import { PluginContext } from "../types/plugin-context";

describe("get-context", () => {
    it("should return a context", () => {
        const context = getContext();
        expect(context).toBeDefined();
    });
});

export function getContext(env: { [key: string]: string } = {}, branchName = "main"): PluginContext {
    return {
        env,
        commits: [],
        branch: {
            name: branchName
        },
        logger: {
            await: jest.fn(),
            complete: jest.fn(),
            debug: jest.fn(),
            error: jest.fn(),
            fatal: jest.fn(),
            fav: jest.fn(),
            info: jest.fn(),
            log: jest.fn(),
            note: jest.fn(),
            pause: jest.fn(),
            pending: jest.fn(),
            star: jest.fn(),
            start: jest.fn(),
            success: jest.fn(),
            wait: jest.fn(),
            warn: jest.fn(),
            watch: jest.fn()
        },
        nextRelease: {
            type: "major",
            name: "test",
            channel: "test",
            gitHead: "012345",
            gitTag: "v1.0.0",
            version: "1.0.0",
            notes: "Hello World"
        }
    };
}
