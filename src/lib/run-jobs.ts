import { JobParameter, SpaceApi } from "jetbrains-space-api";

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
        const job = allJobs.find((j) => j.name.toLowerCase() === jobId.id?.toLowerCase() || j.id === jobId.id);
        if (!job) {
            throw new Error(`Job '${jobId}' not found`);
        }
        context.logger.info(`Starting job '${job.name}'`);
        const startedJob = (
            await client.projectsProjectAutomationJobsJobIdStartPost(pluginConfig.projectId, job.id, {
                branch: { branchName: pluginConfig.branch },
                parameters: buildJobParameters(jobId.parameters ?? {}, context)
            })
        ).data;
        if (!startedJob.executionId) {
            throw new Error(startedJob.message ? `Job '${jobId}' failed: ${startedJob.message}` : `Job '${jobId}' failed`);
        }
        startedJobs.push({ executionId: startedJob.executionId, name: job.name });
    }

    context.logger.info("Waiting for jobs to complete");
    while (Date.now() - start < pluginConfig.jobTimeout * 1000 && startedJobs.length > 0) {
        for (const startedJob of startedJobs) {
            const jobState = (await client.projectsAutomationGraphExecutionsIdGet(startedJob.executionId)).data;
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

/**
 * Builds the job parameters and adds the release information.
 * @param params The job parameters from the config.
 * @param context The plugin context.
 */
function buildJobParameters(params: { [name: string]: string }, context: PluginContext): JobParameter[] {
    const parameters: JobParameter[] = [];

    if (context.nextRelease?.type) {
        parameters.push({ name: "release-type", value: context.nextRelease.type });
    }
    if (context.nextRelease?.channel) {
        parameters.push({ name: "release-channel", value: context.nextRelease.channel });
    }
    if (context.nextRelease?.gitHead) {
        parameters.push({ name: "release-git-head", value: context.nextRelease.gitHead });
    }
    if (context.nextRelease?.gitTag) {
        parameters.push({ name: "release-git-tag", value: context.nextRelease.gitTag });
    }
    if (context.nextRelease?.version) {
        parameters.push({ name: "release-version", value: context.nextRelease.version });
    }
    if (context.nextRelease?.name) {
        parameters.push({ name: "release-name", value: context.nextRelease.name });
    }
    if (context.nextRelease?.notes) {
        parameters.push({ name: "release-notes", value: context.nextRelease.notes });
    }
    if (context.branch?.name) {
        parameters.push({ name: "branch-name", value: context.branch.name });
    }
    if (context.branch?.channel) {
        parameters.push({ name: "branch-channel", value: context.branch.channel });
    }
    if (context.branch?.range) {
        parameters.push({ name: "branch-range", value: context.branch.range });
    }
    if (context.branch?.prerelease) {
        parameters.push({ name: "branch-prerelease", value: context.branch.prerelease.toString() });
    }

    for (const [name, value] of Object.entries(params)) {
        parameters.push({ name, value });
    }
    return parameters;
}
