import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Fills and validates the plugin configuration.
 * Fills in missing plugin configuration options with values from the environment.
 * The plugin configuration reference will be updated in place and returned.
 * If a required configuration option is missing and error is thrown.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @returns The plugin configuration reference.
 * @throws {Error} If a required configuration option is missing.
 */
export function validatePluginConfig(pluginConfig: Partial<PluginConfig>, context: PluginContext): PluginConfig {
    verifyApiToken(pluginConfig, context);
    verifyApiUrl(pluginConfig, context);
    verifyProjectId(pluginConfig, context);
    verifyTargetId(pluginConfig, context);
    setCommitInfo(pluginConfig, context);
    return pluginConfig as PluginConfig;
}

/**
 * Verifies that the plugin configuration has an api token.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @throws {Error} If a required configuration option is missing.
 */
export function verifyApiToken(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (!pluginConfig.apiToken) {
        pluginConfig.apiToken = context.env.JB_SPACE_CLIENT_TOKEN;
    }
    if (!pluginConfig.apiToken) {
        throw new Error("Missing token. Please either set the 'apiToken' plugin option, or set the JB_SPACE_CLIENT_TOKEN environment variable.");
    }
}

/**
 * Verifies that the plugin configuration has an api url.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @throws {Error} If a required configuration option is missing.
 */
export function verifyApiUrl(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (!pluginConfig.apiUrl) {
        pluginConfig.apiUrl = context.env.JB_SPACE_API_URL;
    }
    if (!pluginConfig.apiUrl) {
        throw new Error("Missing api url. Please either set the 'apiUrl' plugin option, or set the JB_SPACE_API_URL environment variable.");
    }
}

/**
 * Verifies that the plugin configuration has a project id.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @throws {Error} If a required configuration option is missing.
 */
export function verifyProjectId(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (!pluginConfig.projectId) {
        pluginConfig.projectId = context.env.JB_SPACE_PROJECT_ID;
    }
    if (!pluginConfig.projectId) {
        throw new Error("Missing project id. Please either set the 'projectId' plugin option, or set the JB_SPACE_PROJECT_ID environment variable.");
    }
}

/**
 * Verifies that the plugin configuration has a target id.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @throws {Error} If a required configuration option is missing.
 */
export function verifyTargetId(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (!pluginConfig.targetId) {
        pluginConfig.targetId = context.env.JB_SPACE_TARGET_ID;
    }
    if (!pluginConfig.targetId) {
        throw new Error("Missing target id. Please either set the 'targetId' plugin option, or set the JB_SPACE_TARGET_ID environment variable.");
    }
}

/**
 * Sets the commit information in the plugin configuration.
 * @param pluginConfig
 * @param context
 */
export function setCommitInfo(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (!pluginConfig.repositoryName) {
        pluginConfig.repositoryName = context.env.JB_SPACE_GIT_REPOSITORY_NAME;
    }
    if (!pluginConfig.branch) {
        pluginConfig.branch = context.branch?.name || context.env.JB_SPACE_GIT_BRANCH;
    }
}
