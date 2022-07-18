import { createDeploymentTargetIfNeeded } from "../lib/create-deployment-target-if-needed";
import { getSpaceApi } from "../lib/get-space-api";
import { handleError } from "../lib/handle-error";
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
        const client = getSpaceApi(pluginConfig);
        await createDeploymentTargetIfNeeded(client, pluginConfig);
    } catch (error) {
        handleError("Failed to prepare deployment", error);
    }
}
