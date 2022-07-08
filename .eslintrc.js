module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        sourceType: "module"
    },
    plugins: ["@typescript-eslint/eslint-plugin", "unused-imports"],
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended"],
    root: true,
    env: {
        node: true,
        jest: true
    },
    ignorePatterns: [".eslintrc.js", "jest-e2e.json"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/explicit-module-boundary-types": "error",
        "@typescript-eslint/explicit-member-accessibility": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": "off",
        "unused-imports/no-unused-imports": "error",
        "unused-imports/no-unused-vars": ["error", { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }]
    }
};
