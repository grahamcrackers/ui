import type { StorybookConfig } from "@storybook/react-vite";

import { dirname, join } from "path";

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string) {
    return dirname(require.resolve(join(value, "package.json")));
}

const config: StorybookConfig = {
    stories: ["../stories/**/*.mdx", "../stories/**/*.stories.@(js|jsx|mjs|ts|tsx)"],
    addons: [
        getAbsolutePath("@chromatic-com/storybook"),
        getAbsolutePath("@storybook/addon-docs"),
        // getAbsolutePath("@storybook/addon-onboarding"),
        getAbsolutePath("@storybook/addon-a11y"),
    ],
    framework: {
        name: getAbsolutePath("@storybook/react-vite"),
        options: {},
    },
    viteFinal: async (config) => {
        // Configure Vite to handle workspace packages for hot reloading
        if (config.resolve) {
            config.resolve.alias = {
                ...config.resolve.alias,
                // Alias the components package to its source directory
                "@grahamcrackers/components": join(__dirname, "../../../packages/components/src"),
                "@grahamcrackers/ui-themes": join(__dirname, "../../../packages/themes"),
                "@/utils/cn": join(__dirname, "../../../packages/components/src/utils/cn"),
            };
        }

        return config;
    },
};

export default config;
