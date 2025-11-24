

import React, { useCallback, type PropsWithChildren } from "react";
import { useLocalStorage } from "usehooks-ts";

export type Theme = "dark" | "light" | "wireframe" | "system";
export type Scale = "desktop" | "mobile";

type ThemeStorageState = {
    theme: Theme;
    scale: Scale;
};

type ThemeProviderProps = PropsWithChildren<{
    defaultTheme?: Theme;
    defaultScale?: Scale;
    theme?: Theme;
    storageKey?: string;
}>;

type ThemeProviderState = {
    theme: Theme;
    scale: Scale;
    setTheme: (theme: Theme) => void;
    setScale: (scale: Scale) => void;
};

const initialState: ThemeProviderState = {
    theme: "system",
    scale: "desktop",
    setTheme: () => null,
    setScale: () => null,
};

export const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
    children,
    defaultTheme = "system",
    defaultScale = "desktop",
    storageKey = "gui-theme",
    ...props
}: ThemeProviderProps) {
    const [appearance, setAppearance] = useLocalStorage<ThemeStorageState>(storageKey, {
        theme: defaultTheme,
        scale: defaultScale,
    });

    React.useEffect(() => {
        const root = window.document.documentElement;

        // Remove all theme classes
        root.classList.remove("dark", "light", "wireframe");

        // Add appropriate theme class
        if (appearance.theme === "system") {
            const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            root.classList.add(systemTheme);
        } else {
            root.classList.add(appearance.theme);
        }

        // Remove all scale classes
        root.classList.remove("desktop", "mobile");

        // Add appropriate scale class
        root.classList.add(appearance.scale);
    }, [appearance.theme, appearance.scale]);

    const handleSetTheme = useCallback(
        (theme: Theme) => {
            setAppearance((prev) => ({ ...prev, theme }));
        },
        [setAppearance],
    );

    const handleSetScale = useCallback(
        (scale: Scale) => {
            setAppearance((prev) => ({ ...prev, scale }));
        },
        [setAppearance],
    );

    const value = React.useMemo(
        () => ({
            theme: appearance.theme,
            scale: appearance.scale,
            setTheme: handleSetTheme,
            setScale: handleSetScale,
        }),
        [appearance.theme, appearance.scale, handleSetTheme, handleSetScale],
    );

    return (
        <ThemeProviderContext.Provider {...props} value={value}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
