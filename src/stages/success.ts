import { finishDeployment } from "../lib/finish-deployment";
import { getSpaceApi } from "../lib/get-space-api";
import { handleError } from "../lib/handle-error";
import { validatePluginConfig } from "../lib/validate-plugin-config";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Runs the "success" stage of the plugin.
 * Calls the Space API to mark the deployment as finished.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 */
export async function success(pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    try {
        validatePluginConfig(pluginConfig, context);
        const client = getSpaceApi(pluginConfig);
        await finishDeployment(client, pluginConfig, context);
    } catch (error) {
        handleError("Failed to mark deployment as finished", error);
    }
}
