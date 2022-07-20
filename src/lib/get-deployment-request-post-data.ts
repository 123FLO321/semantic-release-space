import { ProjectsProjectAutomationDeploymentsStartPostRequest } from "jetbrains-space-api";
import { TargetIdentifier } from "jetbrains-space-api/src/generated/api";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * Gets the post data for a deployment request from the given config and context and target id.
 * @param pluginConfig
 * @param context
 * @param targetId
 */
export function getDeploymentRequestPostData(
    pluginConfig: PluginConfig,
    context: PluginContext,
    targetId: string
): Pick<ProjectsProjectAutomationDeploymentsStartPostRequest, "targetIdentifier" | "version" | "description" | "commitRefs"> {
    return {
        // cast needed until https://github.com/OpenAPITools/openapi-generator/issues/12432 is resolved
        targetIdentifier: targetId as unknown as TargetIdentifier,
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
