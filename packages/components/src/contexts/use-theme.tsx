import React from "react";

import { ThemeProviderContext } from "./theme-provider";

export const useTheme = () => {
    const context = React.useContext(ThemeProviderContext);

    if (context === undefined) {
        const err = new Error("useTheme must be used within a <ThemeProvider />");
        if (Error.captureStackTrace) Error.captureStackTrace(err, useTheme);
        throw err;
    }

    return context;
};
