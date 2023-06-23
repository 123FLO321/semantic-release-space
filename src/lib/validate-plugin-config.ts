import { JobBranchConfiguration, JobConfigurationOptions } from "../types/job-configuration";
import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";
import { toBoolean } from "./to-boolean";

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
    context.logger.info("Validating plugin configuration");
    setCommitInfo(pluginConfig, context);
    verifyApiToken(pluginConfig, context);
    verifyApiUrl(pluginConfig, context);
    verifyProjectId(pluginConfig, context);
    verifyTargetId(pluginConfig, context);
    verifyJobId(pluginConfig, context);
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
        pluginConfig.apiToken = context.env.JB_SPACE_TOKEN || context.env.JB_SPACE_CLIENT_TOKEN;
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
 * Parses the target configuration into current target ids.
 * Verifies that at least on target id is present, unless require target is false.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @throws {Error} If a required configuration option is missing.
 */
export function verifyTargetId(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (Array.isArray(pluginConfig.target)) {
        pluginConfig.currentTargetIds = pluginConfig.target;
    } else if (typeof pluginConfig.target === "string") {
        pluginConfig.currentTargetIds = [pluginConfig.target];
    } else if (typeof pluginConfig.target === "object") {
        const branchTarget = pluginConfig.target[pluginConfig.branch ?? ""];
        if (Array.isArray(branchTarget)) {
            pluginConfig.currentTargetIds = branchTarget;
        } else {
            pluginConfig.currentTargetIds = [branchTarget];
        }
    } else if (typeof pluginConfig.targetId === "string") {
        pluginConfig.currentTargetIds = [pluginConfig.targetId];
    } else if (context.env.JB_SPACE_TARGET_ID) {
        pluginConfig.currentTargetIds = context.env.JB_SPACE_TARGET_ID.split(",");
    }
    pluginConfig.currentTargetIds = pluginConfig.currentTargetIds?.filter((id) => id) ?? [];

    if (pluginConfig.requireTarget == null) {
        pluginConfig.requireTarget = context.env.JB_SPACE_REQUIRE_TARGET ? toBoolean(context.env.JB_SPACE_REQUIRE_TARGET) : true;
    }

    if (!pluginConfig.currentTargetIds || !pluginConfig.currentTargetIds.length) {
        if (pluginConfig.requireTarget) {
            throw new Error("Missing target id. Please either set the 'target' plugin option, or set the JB_SPACE_TARGET_ID environment variable.");
        }
    }
}

/**
 * Parses the job configuration into current job ids.
 * @param pluginConfig The plugin configuration to fill and validate.
 * @param context The plugin context.
 * @throws {Error} If a required configuration option is missing.
 */
export function verifyJobId(pluginConfig: Partial<PluginConfig>, context: PluginContext): void {
    if (Array.isArray(pluginConfig.job) || typeof pluginConfig.job === "string") {
        pluginConfig.currentJobIds = parseJobBranchConfigurationOptions(pluginConfig.job);
    } else if (typeof pluginConfig.job === "object") {
        const branchTarget = (pluginConfig.job as { [branch: string]: JobBranchConfiguration })[pluginConfig.branch ?? ""] ?? [pluginConfig.job];
        pluginConfig.currentJobIds = parseJobBranchConfigurationOptions(branchTarget);
    } else if (context.env.JB_SPACE_JOB_ID) {
        pluginConfig.currentJobIds = parseJobBranchConfigurationOptions(context.env.JB_SPACE_JOB_ID.split(","));
    }
    pluginConfig.currentJobIds = pluginConfig.currentJobIds?.filter((id) => id?.id) ?? [];

    if (!pluginConfig.jobTimeout) {
        pluginConfig.jobTimeout = Number(context.env.JB_SPACE_JOB_TIMEOUT) || 3600;
    }
    if (!pluginConfig.jobCheckInterval) {
        pluginConfig.jobCheckInterval = Number(context.env.JB_SPACE_JOB_CHECK_INTERVAL) || 10;
    }
}

/**
 * Parses the job branch configuration into job configuration options.
 * @param jobConfig The job configuration to parse.
 */
function parseJobBranchConfigurationOptions(jobConfig: JobBranchConfiguration): JobConfigurationOptions[] {
    const options: JobConfigurationOptions[] = [];
    for (const config of Array.isArray(jobConfig) ? jobConfig : [jobConfig]) {
        if (typeof config === "string") {
            options.push({ id: config });
        } else if (typeof config === "object") {
            options.push({ id: config.id, parameters: config.parameters });
        }
    }
    return options;
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
