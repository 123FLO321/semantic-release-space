import { validatePluginConfig } from "../lib/validate-plugin-config";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Runs the "verifyConditions" stage of the plugin.
 * Verifies that the plugin configuration and context are valid.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 */
export function verifyConditions(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    try {
        validatePluginConfig(pluginConfig, context);
    } catch (error) {
        context.logger.error("Failed to verify plugin configuration", (error as Error).message);
        throw error;
    }
}
