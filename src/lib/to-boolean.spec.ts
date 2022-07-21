import { toBoolean } from "./to-boolean";

describe("toBoolean", () => {
    it("true should become true", () => {
        expect(toBoolean(true)).toBe(true);
    });

    it("1 should become true", () => {
        expect(toBoolean(1)).toBe(true);
    });

    it("'true' should become true", () => {
        expect(toBoolean("true")).toBe(true);
    });

    it("'yes' should become true", () => {
        expect(toBoolean("yes")).toBe(true);
    });

    it("'1' should become true", () => {
        expect(toBoolean("1")).toBe(true);
    });

    it("false should become false", () => {
        expect(toBoolean(false)).toBe(false);
    });

    it("0 should become false", () => {
        expect(toBoolean(0)).toBe(false);
    });

    it("'false' should become false", () => {
        expect(toBoolean("false")).toBe(false);
    });

    it("'no' should become false", () => {
        expect(toBoolean("no")).toBe(false);
    });

    it("'0' should become false", () => {
        expect(toBoolean("0")).toBe(false);
    });

    it("null should become false", () => {
        expect(toBoolean(null)).toBe(false);
    });

    it("undefined should become false", () => {
        expect(toBoolean(undefined)).toBe(false);
    });
});
