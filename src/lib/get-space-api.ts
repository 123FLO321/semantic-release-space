import { Configuration, SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";

/**
 * Creates a new Space API client instance from the given configuration.
 * @param pluginConfig The plugin configuration.
 */
export function getSpaceApi(pluginConfig: Partial<PluginConfig>): SpaceApi {
    return new SpaceApi(
        new Configuration({
            basePath: `${pluginConfig.apiUrl}/api/http`,
            accessToken: pluginConfig.apiToken?.split(":").pop()
        })
    );
}
