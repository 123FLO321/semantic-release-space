import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Starts jobs for the given context and waits for them to finish.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 * @throws {Error} If the request fails.
 */
export async function runJobs(client: SpaceApi, pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    if (pluginConfig.currentTargetIds.length === 0) {
        return;
    }

    const allJobs = (await client.projectsProjectAutomationJobsGet(pluginConfig.projectId, pluginConfig.repositoryName ?? "", pluginConfig.branch))
        .data.data;

    const start = Date.now();
    const startedJobs: { executionId: string; name: string }[] = [];
    for (const jobId of pluginConfig.currentJobIds) {
        const job = allJobs.find((j) => j.name.toLowerCase() === jobId.toLowerCase() || j.id === jobId);
        if (!job) {
            throw new Error(`Job '${jobId}' not found`);
        }
        context.logger.info(`Starting job '${job.name}'`);
        const startedJob = (
            await client.projectsProjectAutomationJobsJobIdStartPost(pluginConfig.projectId, job.id, {
                branch: { branchName: pluginConfig.branch }
            })
        ).data;
        startedJobs.push({ executionId: startedJob.executionId, name: job.name });
    }

    context.logger.info("Waiting for jobs to complete");
    while (Date.now() - start < pluginConfig.jobTimeout * 1000 && startedJobs.length > 0) {
        for (const startedJob of startedJobs) {
            const jobState = (await client.projectsAutomationGraphExecutionsIdGet(startedJob.executionId)).data;
            jobState.status;
            if (jobState.status === "FAILED") {
                throw new Error(`Job '${startedJob.name}' failed`);
            } else if (jobState.status === "TERMINATED") {
                throw new Error(`Job '${startedJob.name}' terminated`);
            } else if (jobState.status === "FINISHED") {
                context.logger.info(`Job '${startedJob.name}' finished`);
                startedJobs.splice(startedJobs.indexOf(startedJob), 1);
            }
        }
        await new Promise((resolve) => setTimeout(resolve, pluginConfig.jobCheckInterval * 1000));
    }

    if (startedJobs.length > 0) {
        throw new Error("Timeout running jobs");
    }
}
