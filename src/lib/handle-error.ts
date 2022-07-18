import { AxiosError } from "axios";

import { SemanticReleaseError } from "./semantic-release-error";

/**
 * Handles unknown errors by converting them to a SemanticReleaseError and logging to the error logger.
 * @param description The error description.
 * @param error The error to handle.
 */
export function handleError(description: string, error: unknown): never {
    let errorMessage;
    let stack: string | undefined;
    if (error instanceof AxiosError) {
        errorMessage = `Space API request failed with status ${error.response?.status ?? "?"}`;
        if (error.response && "error_description" in error.response.data) {
            errorMessage += `: ${error.response.data["error_description"]}`;
        } else if (error.response && "statusText" in error.response) {
            errorMessage += `: ${error.response["statusText"]}`;
        }
        stack = error.stack;
    } else if (error instanceof Error) {
        errorMessage = error.message;
        stack = error.stack;
    } else {
        errorMessage = `${error}`;
    }
    throw new SemanticReleaseError(description, errorMessage, stack);
}
