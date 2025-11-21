import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import mdxPlugin from "eslint-plugin-mdx";
import onlyWarn from "eslint-plugin-only-warn";
import storybookPlugin from "eslint-plugin-storybook";
import { resolve } from "node:path";
import tseslint from "typescript-eslint";

const project = resolve(process.cwd(), "tsconfig.json");

/**
 * This is a custom ESLint configuration for use with
 * typescript packages and Storybook.
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
        files: ["**/*.stories.@(ts|tsx|js|jsx|mjs|cjs)", "**/*.story.@(ts|tsx|js|jsx|mjs|cjs)"],
        ...storybookPlugin.configs.recommended,
    },
    {
        files: ["**/*.mdx"],
        ...mdxPlugin.configs.recommended,
    },
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
        rules: {
            "import/no-default-export": "off",
        },
    },
    {
        ignores: ["node_modules/", "dist/"],
    },
];
