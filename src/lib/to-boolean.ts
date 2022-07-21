/**
 * Converts a value of type string, number, boolean, null or undefined into a boolean.
 * @param value The value to convert.
 */
export function toBoolean(value: string | number | boolean | null | undefined): boolean {
    if (typeof value === "boolean") {
        return value;
    } else if (typeof value === "number") {
        return Boolean(value);
    } else if (value == null) {
        return false;
    } else {
        switch (value.toString().toLowerCase().trim()) {
            case "true":
            case "yes":
            case "1":
                return true;
            default:
                return false;
        }
    }
}
