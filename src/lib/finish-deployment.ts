import { SpaceApi } from "jetbrains-space-api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";
import { getDeploymentRequestPostData } from "./get-deployment-request-post-data";

/**
 * Marks the deployment as finished for the given context.
 * @param client The Space API client.
 * @param pluginConfig The plugin configuration.
 * @param context The plugin context.
 * @throws {Error} If the request fails.
 */
export async function finishDeployment(client: SpaceApi, pluginConfig: PluginConfig, context: PluginContext): Promise<void> {
    await client.projectsProjectAutomationDeploymentsFinishPost(pluginConfig.projectId, getDeploymentRequestPostData(pluginConfig, context));
}
