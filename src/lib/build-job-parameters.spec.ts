import { buildJobParameters } from "./build-job-parameters";
import { getContext } from "./get-context.spec";

describe("build-job-parameters", () => {
    it("should correctly build parameters", () => {
        const context = getContext();
        expect(buildJobParameters({}, context)).toEqual([]);
        expect(buildJobParameters({ test: "test" }, context)).toEqual([{ name: "test", value: "test" }]);
        expect(buildJobParameters({ test: "test", hello: "world" }, context)).toEqual([
            { name: "test", value: "test" },
            { name: "hello", value: "world" }
        ]);
        expect(buildJobParameters({ version: "{{nextRelease.version}}" }, context)).toEqual([{ name: "version", value: "1.0.0" }]);
        expect(buildJobParameters({ channel: "{{#if nextRelease.channel}}{{nextRelease.channel}}{{else}}latest{{/if}}" }, context)).toEqual([
            { name: "channel", value: "test" }
        ]);
    });
});
