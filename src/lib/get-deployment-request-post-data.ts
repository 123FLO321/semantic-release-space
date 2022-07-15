import { ProjectsProjectAutomationDeploymentsStartPostRequest } from "jetbrains-space-api";
import { TargetIdentifier } from "jetbrains-space-api/src/generated/api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Gets the post data for a deployment request from the given config and context.
 * @param pluginConfig
 * @param context
 */
export function getDeploymentRequestPostData(
    pluginConfig: PluginConfig,
    context: PluginContext
): Pick<ProjectsProjectAutomationDeploymentsStartPostRequest, "targetIdentifier" | "version" | "description" | "commitRefs"> {
    return {
        // cast needed until https://github.com/OpenAPITools/openapi-generator/issues/12432 is resolved
        targetIdentifier: pluginConfig.targetId as unknown as TargetIdentifier,
        version: context.nextRelease?.version,
        description: context.nextRelease?.notes,
        commitRefs:
            context.nextRelease?.gitHead && pluginConfig.branch && pluginConfig.repositoryName
                ? [
                      {
                          repositoryName: pluginConfig.repositoryName,
                          branch: pluginConfig.branch,
                          commit: context.nextRelease.gitHead
                      }
                  ]
                : undefined
    };
}
