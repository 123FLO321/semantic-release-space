import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Verifies that the Space API credentials are correct.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 * @throws {Error} If the request fails.
 */
export async function verifySpaceApi(client: SpaceApi, pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    context.logger.info("Verifying Space API credentials");
    const project = await client.projectsProjectGet(pluginConfig.projectId);
    if (!project?.data?.id) {
        throw new Error("Failed to get project infos from Space API");
    }
}
