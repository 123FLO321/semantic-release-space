import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";
import { setCommitInfo, verifyApiToken, verifyApiUrl, verifyJobId, verifyProjectId, verifyTargetId } from "./validate-plugin-config";

describe("validate-plugin-config", () => {
    it("should throw an error if the api token is not set", () => {
        expect(() => verifyApiToken({}, getContext())).toThrow();
    });

    it("should set the api token from config", () => {
        const config = getConfig({ apiToken: "xxx" });
        const context = getContext();
        expect(() => verifyApiToken(config, context)).not.toThrow();
        expect(config.apiToken).toEqual("xxx");
    });

    it("should set the api token from client token environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_CLIENT_TOKEN: "xxx" });
        expect(() => verifyApiToken(config, context)).not.toThrow();
        expect(config.apiToken).toEqual("xxx");
    });

    it("should set api token from token over client token environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_TOKEN: "xxx", JB_SPACE_CLIENT_TOKEN: "yyy" });
        expect(() => verifyApiToken(config, context)).not.toThrow();
        expect(config.apiToken).toEqual("xxx");
    });

    it("should throw an error if the api url is not set", () => {
        expect(() => verifyApiUrl({}, getContext())).toThrow();
    });

    it("should set the api url from config", () => {
        const config = getConfig({ apiUrl: "https://example.com" });
        const context = getContext();
        expect(() => verifyApiUrl(config, context)).not.toThrow();
        expect(config.apiUrl).toEqual("https://example.com");
    });

    it("should set the api url form environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_API_URL: "https://example.com" });
        expect(() => verifyApiUrl(config, context)).not.toThrow();
        expect(config.apiUrl).toEqual("https://example.com");
    });

    it("should throw an error if the project id is not set", () => {
        expect(() => verifyProjectId({}, getContext())).toThrow();
    });

    it("should set the project id from config", () => {
        const config = getConfig({ projectId: "12345" });
        const context = getContext();
        expect(() => verifyProjectId(config, context)).not.toThrow();
        expect(config.projectId).toEqual("12345");
    });

    it("should throw an error if the target id is not set", () => {
        expect(() => verifyTargetId({}, getContext())).toThrow();
    });

    it("should not throw an error if the target id is set and require target is false by config", () => {
        expect(() => verifyTargetId({ requireTarget: false }, getContext())).not.toThrow();
    });

    it("should not throw an error if the target id is set and require target is false by environment", () => {
        expect(() => verifyTargetId({}, getContext({ JB_SPACE_REQUIRE_TARGET: "false" }))).not.toThrow();
    });

    it("should set single target id from deprecated config", () => {
        const config = getConfig({ targetId: "example" });
        const context = getContext();
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example"]);
    });

    it("should set single target id from config", () => {
        const config = getConfig({ target: "example" });
        const context = getContext();
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example"]);
    });

    it("should set single target id from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_TARGET_ID: "example" });
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example"]);
    });

    it("should set multiple target ids from config", () => {
        const config = getConfig({ target: ["example", "other"] });
        const context = getContext();
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example", "other"]);
    });

    it("should set multiple target ids from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_TARGET_ID: "example,other" });
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example", "other"]);
    });

    it("should set single target id from branch config", () => {
        const config = getConfig({ branch: "main", target: { main: "example" } });
        const context = getContext();
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example"]);
    });

    it("should set multiple target ids from branch config", () => {
        const config = getConfig({ branch: "main", target: { main: ["example", "other"] } });
        const context = getContext();
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.currentTargetIds).toEqual(["example", "other"]);
    });

    it("should not throw an error if no job config is set", () => {
        expect(() => verifyJobId({}, getContext())).not.toThrow();
    });

    it("should set single job id from config", () => {
        const config = getConfig({ job: "example" });
        const context = getContext();
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example" }]);
    });

    it("should set single job id from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_JOB_ID: "example" });
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example" }]);
    });

    it("should set multiple job ids from config", () => {
        const config = getConfig({ job: ["example", "other"] });
        const context = getContext();
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example" }, { id: "other" }]);
    });

    it("should set multiple job ids from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_JOB_ID: "example,other" });
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example" }, { id: "other" }]);
    });

    it("should set single job id from branch config", () => {
        const config = getConfig({ branch: "main", job: { main: "example" } });
        const context = getContext();
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example" }]);
    });

    it("should set multiple job ids from branch config", () => {
        const config = getConfig({ branch: "main", job: { main: ["example", "other"] } });
        const context = getContext();
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example" }, { id: "other" }]);
    });

    it("should set single job with parameters from config", () => {
        const config = getConfig({
            branch: "main",
            job: { id: "example", parameters: { example1: "hello", example2: "world" } }
        });
        const context = getContext();
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([{ id: "example", parameters: { example1: "hello", example2: "world" } }]);
    });

    it("should set multiple jobs with parameters from branch config", () => {
        const config = getConfig({
            branch: "main",
            job: {
                main: [
                    { id: "example", parameters: { example1: "hello", example2: "world" } },
                    { id: "other", parameters: {} }
                ]
            }
        });
        const context = getContext();
        expect(() => verifyJobId(config, context)).not.toThrow();
        expect(config.currentJobIds).toEqual([
            { id: "example", parameters: { example1: "hello", example2: "world" } },
            { id: "other", parameters: {} }
        ]);
    });

    it("should set the commit info from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_GIT_BRANCH: "branch", JB_SPACE_GIT_REPOSITORY_NAME: "EXAMPLE" }, "");
        expect(() => setCommitInfo(config, context)).not.toThrow();
        expect(config.branch).toEqual("branch");
        expect(config.repositoryName).toEqual("EXAMPLE");
    });
});

function getContext(env: { [key: string]: string } = {}, branchName = "main"): PluginContext {
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
        }
    };
}

function getConfig(config: Partial<PluginConfig> = {}): Partial<PluginConfig> {
    return config;
}
