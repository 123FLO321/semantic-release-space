import { Context } from "semantic-release";

/**
 * The plugin context.
 */
export interface PluginContext extends Context {
    /** The current branch. */
    branch?: {
        /** The current branch name. */
        name?: string;
    };
}
