import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";
import { setCommitInfo, verifyApiToken, verifyApiUrl, verifyProjectId, verifyTargetId } from "./validate-plugin-config";

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

    it("should set the api token from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_CLIENT_TOKEN: "xxx" });
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

    it("should set the target id from config", () => {
        const config = getConfig({ targetId: "example" });
        const context = getContext();
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.targetId).toEqual("example");
    });

    it("should set the target id from environment", () => {
        const config = getConfig();
        const context = getContext({ JB_SPACE_TARGET_ID: "example" });
        expect(() => verifyTargetId(config, context)).not.toThrow();
        expect(config.targetId).toEqual("example");
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
            log: jest.fn(),
            error: jest.fn()
        }
    };
}

function getConfig(config: Partial<PluginConfig> = {}): Partial<PluginConfig> {
    return config;
}
