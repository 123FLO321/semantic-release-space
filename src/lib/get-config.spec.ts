import { PluginConfig } from "../types/plugin-config";

describe("get-config", () => {
    it("should return a config", () => {
        const config = getConfig();
        expect(config).toBeDefined();
    });
});

export function getConfig(config: Partial<PluginConfig> = {}): Partial<PluginConfig> {
    return config;
}
