import { JobConfiguration } from "./job-configuration";
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
    target?: TargetConfiguration;
    /** @deprecated The deployment target id. Use `target` instead. */
    targetId?: string;
    /** @internal The current deployment target ids. Use `target` instead. */
    currentTargetIds: string[];
    /** Indicates if an invalid target configuration should throw an error. */
    requireTarget: boolean;

    /** The job configuration. */
    job?: JobConfiguration;
    /** @internal The current deployment target ids. Use `target` instead. */
    currentJobIds: string[];
    /** The timeout in seconds waiting for the job to complete. */
    jobTimeout: number;
    /** The wait time in seconds between each job status check. */
    jobCheckInterval: number;

    /** The current repository name */
    repositoryName: string;

    /** @internal The current branch. */
    branch: string;
}
