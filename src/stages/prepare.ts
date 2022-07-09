import { SpaceApiClient } from "../lib/space-api-client";
import { validatePluginConfig } from "../lib/validate-plugin-config";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Runs the "prepare" stage of the plugin.
 * Calls the Space API to create a deployment target if it doesn't exist.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 */
export async function prepare(pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    try {
        validatePluginConfig(pluginConfig, context);
        const client = new SpaceApiClient(pluginConfig);
        await client.createDeploymentTargetIfNotExists();
    } catch (error) {
        context.logger.error("Failed to prepare deployment", (error as Error).message);
        throw error;
    }
}
