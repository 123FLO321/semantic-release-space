import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";

/**
 * Verifies that the Space API credentials are correct.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @throws {Error} If the request fails.
 */
export async function verifySpaceApi(client: SpaceApi, pluginConfig: PluginConfig): Promise<void> {
    const project = await client.projectsProjectGet(pluginConfig.projectId);
    if (!project?.data?.id) {
        throw new Error("Failed to get project infos from Space API");
    }
}
