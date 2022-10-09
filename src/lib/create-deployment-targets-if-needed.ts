import { AxiosError } from "axios";
import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Calls the Space API to create deployment targets if they doesn't exist.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 * @throws {Error} If the request fails.
 */
export async function createDeploymentTargetsIfNeeded(client: SpaceApi, pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    for (const targetId of pluginConfig.currentTargetIds) {
        try {
            context.logger.info(`Checking if deployment target '${targetId}' exists`);
            await client.projectsProjectAutomationDeploymentTargetsGet(pluginConfig.projectId, `key:${targetId.toLowerCase()}`);
        } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
                context.logger.info(`Creating deployment target '${targetId}'`);
                await client.projectsProjectAutomationDeploymentTargetsPost(pluginConfig.projectId, {
                    key: targetId.toLowerCase(),
                    name: targetId,
                    description: targetId
                });
            } else {
                throw error;
            }
        }
    }
}
