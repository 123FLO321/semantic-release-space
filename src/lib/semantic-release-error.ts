/**
 * Semantic release plugin error used to report.
 * Defined here, because @semantic-release/error does not provide typings.
 */
export class SemanticReleaseError extends Error {
    public readonly semanticRelease = true;
    public readonly code: string;

    public constructor(description: string, message: string, stack?: string) {
        super(message);
        this.code = `${description}:`;
        if (stack) {
            this.stack = stack;
        }
    }
}
