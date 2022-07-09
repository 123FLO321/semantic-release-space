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
    /** The deployment target id. */
    targetId: string;
    /** The current repository name */
    repositoryName?: string;
    /** The current branch. */
    branch?: string;
}
