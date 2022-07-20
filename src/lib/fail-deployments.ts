import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";
import { getDeploymentRequestPostData } from "./get-deployment-request-post-data";

/**
 * Marks the deployments as failed for the given context.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 * @throws {Error} If the request fails.
 */
export async function failDeployments(client: SpaceApi, pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    for (const targetId of pluginConfig.currentTargetIds) {
        context.logger.info(`Marking deployment as failed for target '${targetId}'`);
        await client.projectsProjectAutomationDeploymentsFailPost(
            pluginConfig.projectId,
            getDeploymentRequestPostData(pluginConfig, context, targetId)
        );
    }
}
