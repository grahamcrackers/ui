import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import {
    convertColorValue,
    convertDimensionValue,
    convertTokenName,
    determineTokenCategory,
    getFontWeightValue,
    hasTokenSets,
    resolveTokenReference,
} from "./converters";
import type { SpectrumTokens, SpectrumTokenValue } from "./token-types";

const SPECTRUM_TOKENS_PATH = join(process.cwd(), "node_modules", "@adobe", "spectrum-tokens", "src");

const TOKEN_FILES = [
    "color-palette.json",
    "semantic-color-palette.json",
    "color-component.json",
    "color-aliases.json",
    "layout.json",
    "layout-component.json",
    "typography.json",
] as const;

interface ProcessedTokens {
    colors: Map<string, string>;
    spacing: Map<string, string>;
    borderRadius: Map<string, string>;
    fontSize: Map<string, string>;
    fontWeight: Map<string, string>;
    fontFamily: Map<string, string>;
    lineHeight: Map<string, string>;
    letterSpacing: Map<string, string>;
    opacity: Map<string, string>;
    boxShadow: Map<string, string>;
}

interface ColorSchemeTokens {
    light: Map<string, string>;
    dark: Map<string, string>;
}

function isComplexValue(value: unknown): boolean {
    return typeof value === "object" && value !== null;
}

function loadTokenFile(filename: string): SpectrumTokens {
    const filePath = join(SPECTRUM_TOKENS_PATH, filename);
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

function extractTokenValue(token: SpectrumTokenValue, colorScheme: "light" | "dark" | null = null): string | null {
    if (hasTokenSets(token)) {
        if (colorScheme && token.sets[colorScheme]) {
            return String(token.sets[colorScheme].value);
        }
        return token.sets.light?.value != null ? String(token.sets.light.value) : null;
    }

    // Token has no sets, must be a regular token
    if (!("sets" in token)) {
        return String(token.value);
    }

    return null;
}

function processTokens(): {
    baseTokens: ProcessedTokens;
    colorSchemeTokens: ColorSchemeTokens;
    allTokensMap: Map<string, string>;
} {
    const baseTokens: ProcessedTokens = {
        colors: new Map(),
        spacing: new Map(),
        borderRadius: new Map(),
        fontSize: new Map(),
        fontWeight: new Map(),
        fontFamily: new Map(),
        lineHeight: new Map(),
        letterSpacing: new Map(),
        opacity: new Map(),
        boxShadow: new Map(),
    };

    const colorSchemeTokens: ColorSchemeTokens = {
        light: new Map(),
        dark: new Map(),
    };

    const allTokensMap = new Map<string, string>();

    for (const filename of TOKEN_FILES) {
        const tokens = loadTokenFile(filename);

        for (const [name, tokenValue] of Object.entries(tokens)) {
            const token = tokenValue as SpectrumTokenValue;

            if ("deprecated" in token && token.deprecated) {
                continue;
            }

            const isPrivate = "private" in token && token.private;

            const lightValue = extractTokenValue(token, "light");
            const darkValue = extractTokenValue(token, "dark");

            if (lightValue != null) {
                allTokensMap.set(name, lightValue);
            }

            if (hasTokenSets(token)) {
                if (token.sets.light) {
                    colorSchemeTokens.light.set(name, String(token.sets.light.value));
                }
                if (token.sets.dark) {
                    colorSchemeTokens.dark.set(name, String(token.sets.dark.value));
                }
                continue;
            }

            // Skip tokens with sets that aren't color sets (like scale-sets)
            if ("sets" in token) {
                continue;
            }

            if (isPrivate) {
                continue;
            }

            const category = determineTokenCategory(token.$schema, name);
            const value = token.value;

            if (isComplexValue(value)) {
                continue;
            }

            const categoryMap = baseTokens[category as keyof ProcessedTokens];
            if (categoryMap && categoryMap instanceof Map) {
                categoryMap.set(name, String(value));
            }
        }
    }

    return { baseTokens, colorSchemeTokens, allTokensMap };
}

function generateCSSTheme(
    baseTokens: ProcessedTokens,
    colorSchemeTokens: ColorSchemeTokens,
    allTokensMap: Map<string, string>,
): string {
    const lines: string[] = [
        "/**",
        " * Adobe Spectrum Design Tokens",
        " * Converted to Tailwind CSS v4 Theme",
        " * Generated from @adobe/spectrum-tokens",
        " */",
        "",
        "@theme {",
    ];

    function addSection(title: string, tokens: Map<string, string>, processor: (value: string) => string) {
        if (tokens.size === 0) {
            return;
        }

        lines.push(`  /* ${title} */`);
        for (const [name, value] of tokens) {
            const resolvedValue = resolveTokenReference(value, allTokensMap);
            const processedValue = processor(resolvedValue);
            const cssVarName = `--${convertTokenName(name)}`;
            lines.push(`  ${cssVarName}: ${processedValue};`);
        }
        lines.push("");
    }

    addSection("Colors", baseTokens.colors, convertColorValue);
    addSection("Spacing", baseTokens.spacing, (v) => convertDimensionValue(v, true));
    addSection("Border Radius", baseTokens.borderRadius, (v) => convertDimensionValue(v, true));
    addSection("Font Size", baseTokens.fontSize, (v) => convertDimensionValue(v, true));
    addSection("Font Weight", baseTokens.fontWeight, getFontWeightValue);
    addSection("Font Family", baseTokens.fontFamily, (v) => v);
    addSection("Line Height", baseTokens.lineHeight, (v) => v);
    addSection("Letter Spacing", baseTokens.letterSpacing, (v) => convertDimensionValue(v, true));
    addSection("Opacity", baseTokens.opacity, (v) => v);
    addSection("Box Shadow", baseTokens.boxShadow, (v) => v);

    lines.push("}");
    lines.push("");

    if (colorSchemeTokens.light.size > 0) {
        lines.push("@media (prefers-color-scheme: light) {");
        lines.push("  :root {");
        for (const [name, value] of colorSchemeTokens.light) {
            const resolvedValue = resolveTokenReference(value, allTokensMap);
            const processedValue = convertColorValue(resolvedValue);
            const cssVarName = `--${convertTokenName(name)}`;
            lines.push(`    ${cssVarName}: ${processedValue};`);
        }
        lines.push("  }");
        lines.push("}");
        lines.push("");
    }

    if (colorSchemeTokens.dark.size > 0) {
        lines.push("@media (prefers-color-scheme: dark) {");
        lines.push("  :root {");
        for (const [name, value] of colorSchemeTokens.dark) {
            const resolvedValue = resolveTokenReference(value, allTokensMap);
            const processedValue = convertColorValue(resolvedValue);
            const cssVarName = `--${convertTokenName(name)}`;
            lines.push(`    ${cssVarName}: ${processedValue};`);
        }
        lines.push("  }");
        lines.push("}");
        lines.push("");
    }

    lines.push('[data-theme="light"] {');
    for (const [name, value] of colorSchemeTokens.light) {
        const resolvedValue = resolveTokenReference(value, allTokensMap);
        const processedValue = convertColorValue(resolvedValue);
        const cssVarName = `--${convertTokenName(name)}`;
        lines.push(`  ${cssVarName}: ${processedValue};`);
    }
    lines.push("}");
    lines.push("");

    lines.push('[data-theme="dark"] {');
    for (const [name, value] of colorSchemeTokens.dark) {
        const resolvedValue = resolveTokenReference(value, allTokensMap);
        const processedValue = convertColorValue(resolvedValue);
        const cssVarName = `--${convertTokenName(name)}`;
        lines.push(`  ${cssVarName}: ${processedValue};`);
    }
    lines.push("}");

    return lines.join("\n");
}

function main() {
    console.log("Loading Spectrum tokens...");
    const { baseTokens, colorSchemeTokens, allTokensMap } = processTokens();

    console.log("Generating Tailwind CSS theme...");
    const cssTheme = generateCSSTheme(baseTokens, colorSchemeTokens, allTokensMap);

    const outputPath = join(process.cwd(), "dist", "spectrum-theme.css");
    const outputDir = dirname(outputPath);

    mkdirSync(outputDir, { recursive: true });
    writeFileSync(outputPath, cssTheme, "utf-8");

    console.log(`✓ Theme generated at: ${outputPath}`);
    console.log(`  - ${baseTokens.colors.size} color tokens`);
    console.log(`  - ${baseTokens.spacing.size} spacing tokens`);
    console.log(`  - ${baseTokens.borderRadius.size} border radius tokens`);
    console.log(`  - ${baseTokens.fontSize.size} font size tokens`);
    console.log(`  - ${colorSchemeTokens.light.size} light mode tokens`);
    console.log(`  - ${colorSchemeTokens.dark.size} dark mode tokens`);
}

main();
