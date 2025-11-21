import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import onlyWarn from "eslint-plugin-only-warn";
import { resolve } from "node:path";
import tseslint from "typescript-eslint";

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * This is a custom ESLint configuration for use with
 * typescript packages.
 *
 * This config extends the Vercel Engineering Style Guide.
 * For more information, see https://github.com/vercel/style-guide
 *
 * @type {import("eslint").Linter.Config}
 */
export const config = [
    js.configs.recommended,
    eslintConfigPrettier,
    ...tseslint.configs.recommended,
    {
        languageOptions: {
            parserOptions: {
                project,
            },
            globals: {
                React: true,
                JSX: true,
            },
        },
        plugins: {
            "only-warn": onlyWarn,
        },
        settings: {
            "import/resolver": {
                typescript: {
                    project,
                },
            },
        },
    },
    {
        ignores: ["node_modules/", "dist/"],
    },
];
