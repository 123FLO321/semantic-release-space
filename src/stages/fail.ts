import { SpaceApiClient } from "../lib/space-api-client";
import { validatePluginConfig } from "../lib/validate-plugin-config";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Runs the "fail" stage of the plugin.
 * Calls the Space API to mark the deployment as failed.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 */
export async function fail(pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    try {
        validatePluginConfig(pluginConfig, context);
        const client = new SpaceApiClient(pluginConfig);
        await client.failDeployment(context);
    } catch (error) {
        context.logger.error("Failed to mark deployment as failed", (error as Error).message);
        throw error;
    }
}
