import React, { PropsWithChildren, useEffect } from "react";

import { ThemeProvider, useTheme } from "@grahamcrackers/components";
import type { Decorator, Parameters } from "@storybook/react-vite";

import "../stories/index.css";

// eslint-disable-next-line react-refresh/only-export-components
function StoryWrapper({ theme, children }: PropsWithChildren<{ theme: string }>) {
    const { setTheme } = useTheme();

    useEffect(() => setTheme(theme as "dark" | "light" | "wireframe" | "system"), [theme, setTheme]);

    return <div className="min-w-64 bg-transparent">{children}</div>;
}

export const parameters: Parameters = {
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/i,
        },
    },
};

export const decorators: Decorator[] = [
    (Story, { globals, ...context }) => {
        const selectedTheme = globals.backgrounds.value ?? "light";

        return (
            <ThemeProvider defaultTheme={selectedTheme}>
                <StoryWrapper theme={selectedTheme}>
                    {Story({ ...context, globals: { ...context.globals, theme: selectedTheme } })}
                </StoryWrapper>
            </ThemeProvider>
        );
    },
];
