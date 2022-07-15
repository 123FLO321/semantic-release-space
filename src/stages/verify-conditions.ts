import { getSpaceApi } from "../lib/get-space-api";
import { validatePluginConfig } from "../lib/validate-plugin-config";
import { verifySpaceApi } from "../lib/verify-space-api";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Runs the "verifyConditions" stage of the plugin.
 * Verifies that the plugin configuration and context are valid.
 * Verifies that the Space API credentials are correct.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 */
export async function verifyConditions(pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    try {
        validatePluginConfig(pluginConfig, context);
        const client = getSpaceApi(pluginConfig);
        await verifySpaceApi(client, pluginConfig);
    } catch (error) {
        context.logger.error("Failed to verify plugin configuration", (error as Error).message);
        throw error;
    }
}
