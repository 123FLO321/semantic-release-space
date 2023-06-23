import Handlebars from "handlebars";
import { JobParameter } from "jetbrains-space-api";

import { PluginContext } from "../types/plugin-context";

/**
 * Builds the job parameters and adds the release information.
 * @param params The job parameters from the config.
 * @param context The plugin context.
 */
export function buildJobParameters(params: { [name: string]: string }, context: PluginContext): JobParameter[] {
    const parameters: JobParameter[] = [];
    for (const [name, value] of Object.entries(params)) {
        parameters.push({ name, value: buildParameter(value, context) });
    }
    return parameters;
}

/**
 * Builds the parameter value template as handlebars template.
 * @param value The parameter value template.
 * @param context The plugin context.
 */
function buildParameter(value: string, context: PluginContext): string {
    return Handlebars.compile(value)(context);
}
