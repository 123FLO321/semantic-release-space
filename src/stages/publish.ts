import { getSpaceApi } from "../lib/get-space-api";
import { handleError } from "../lib/handle-error";
import { startDeployments } from "../lib/start-deployments";
import { validatePluginConfig } from "../lib/validate-plugin-config";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Runs the "publish" stage of the plugin.
 * Calls the Space API to start the deployment.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 */
export async function publish(pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    try {
        validatePluginConfig(pluginConfig, context);
        const client = getSpaceApi(pluginConfig);
        await startDeployments(client, pluginConfig, context);
    } catch (error) {
        handleError("Failed to start deployment", error);
    }
}
