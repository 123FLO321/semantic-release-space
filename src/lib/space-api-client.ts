import { AxiosInstance, default as axios } from "axios";

import { PluginConfig } from "../types/plugin-config";
import { PluginContext } from "../types/plugin-context";

/**
 * A minimal [JetBrains Space API](https://www.jetbrains.com/help/space/api.html) Client for the deployment routes.
 */
export class SpaceApiClient {
    /** The underlying axios instance with the configured headers. */
    public readonly client: AxiosInstance;

    /**
     * Constructs a new SpaceApiClient from the plugin configuration.
     * @param options The plugin configuration.
     * @throws {Error} If the configuration is invalid.
     */
    public constructor(private readonly options: PluginConfig) {
        this.client = axios.create({
            headers: {
                Authorization: `Bearer ${this.options.apiToken}`
            }
        });
    }

    /**
     * Starts a deployment for the given context.
     * @param context The plugin context.
     * @throws {Error} If the request fails.
     */
    public async startDeployment(context: PluginContext): Promise<void> {
        await this.makeDeploymentRequest(["automation", "deployments", "start"], context);
    }

    /**
     * Marks the deployment as failed for the given context.
     * @param context The plugin context.
     * @throws {Error} If the request fails.
     */
    public async failDeployment(context: PluginContext): Promise<void> {
        await this.makeDeploymentRequest(["automation", "deployments", "fail"], context);
    }

    /**
     * Marks the deployment as finished for the given context.
     * @param context The plugin context.
     * @throws {Error} If the request fails.
     */
    public async finishDeployment(context: PluginContext): Promise<void> {
        await this.makeDeploymentRequest(["automation", "deployments", "finish"], context);
    }

    /**
     * Creates a new deployment target for the plugin configuration if the target does not exist yet.
     * @throws {Error} If the request fails.
     */
    public async createDeploymentTargetIfNotExists(): Promise<void> {
        const target = await this.getDeploymentTarget();
        if (!target) {
            await this.createDeploymentTarget();
        }
    }

    /**
     * Creates a new deployment target for the plugin configuration.
     * @throws {Error} If the request fails.
     * @private
     */
    private async createDeploymentTarget(): Promise<void> {
        await this.client.request({
            url: this.getUrl(["automation", "deployment-targets"]),
            method: "POST",
            data: {
                key: this.options.targetId,
                name: this.options.targetId,
                description: this.options.targetId
            }
        });
    }

    /**
     * Gets the deployment target for the plugin configuration if it exists.
     * @returns The deployment target or `undefined` if it does not exist.
     * @throws {Error} If the request fails.
     * @private
     */
    private async getDeploymentTarget(): Promise<{ id: string } | undefined> {
        const response = await this.client.request<{ id: string } | undefined>({
            url: this.getUrl(["automation", "deployment-targets", this.options.targetId]),
            method: "GET",
            validateStatus: (status) => (status >= 200 && status < 300) || status === 404
        });
        if (response.status === 404) {
            return undefined;
        } else {
            return response.data;
        }
    }

    /**
     * Makes a deployment request to the JetBrains Space API.
     * @param path The path of the request.
     * @param context The plugin context.
     * @throws {Error} If the request fails.
     * @private
     */
    private async makeDeploymentRequest(path: string[], context: PluginContext): Promise<void> {
        await this.client.request<{ id: string }>({
            url: this.getUrl(path),
            method: "POST",
            data: {
                targetIdentifier: this.options.targetId,
                version: context.nextRelease?.version,
                description: context.nextRelease?.notes,
                commitRefs:
                    context.nextRelease?.gitHead && this.options.branch && this.options.repositoryName
                        ? [
                              {
                                  repositoryName: this.options.repositoryName,
                                  branch: this.options.branch,
                                  commit: context.nextRelease.gitHead
                              }
                          ]
                        : undefined
            }
        });
    }

    /**
     * Builds an JetBrains Space API URL from the given path.
     * @param path The path of the URL.
     * @returns The URL.
     * @private
     */
    private getUrl(path: string[]): string {
        return `${this.options.apiUrl}/api/http/projects/id:${this.options.projectId}/${path.join("/")}`;
    }
}
