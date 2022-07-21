import { TargetConfiguration } from "./target-configuration";

/**
 * The plugin configuration.
 */
export interface PluginConfig {
    /** The api token. */
    apiToken: string;
    /** The api url. */
    apiUrl: string;
    /** The project id. */
    projectId: string;
    /** The deployment target. */
    target: TargetConfiguration;
    /** @deprecated The deployment target id. Use `target` instead. */
    targetId: string;
    /** @internal The current deployment target ids. Use `target` instead. */
    currentTargetIds: string[];
    /** Indicates if an invalid target configuration should throw an error. */
    requireTarget: boolean;
    /** The current repository name */
    repositoryName?: string;
    /** The current branch. */
    branch?: string;
}
