import { AxiosError } from "axios";
import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";

/**
 * Calls the Space API to create a deployment target if it doesn't exist.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @throws {Error} If the request fails.
 */
export async function createDeploymentTargetIfNeeded(client: SpaceApi, pluginConfig: PluginConfig): Promise<void> {
    try {
        await client.projectsProjectAutomationDeploymentTargetsIdentifierGet(pluginConfig.projectId, `key:${pluginConfig.targetId}`);
    } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
            await client.projectsProjectAutomationDeploymentTargetsPost(pluginConfig.projectId, {
                key: pluginConfig.targetId,
                name: pluginConfig.targetId,
                description: pluginConfig.targetId
            });
        } else {
            throw error;
        }
    }
}
