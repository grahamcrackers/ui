import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { convertColorValue, hasTokenSets } from "./converters";
import type { SpectrumTokens, SpectrumTokenValue } from "./token-types";

const SPECTRUM_TOKENS_PATH = join(process.cwd(), "node_modules", "@adobe", "spectrum-tokens", "src");

const COLOR_FILES = ["color-palette.json", "semantic-color-palette.json", "color-aliases.json", "icons.json"] as const;

function loadTokenFile(filename: string): SpectrumTokens {
    const filePath = join(SPECTRUM_TOKENS_PATH, filename);
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

function extractColorValue(
    token: SpectrumTokenValue,
    colorScheme: "light" | "dark" | "wireframe" = "light",
): string | null {
    if (hasTokenSets(token)) {
        const schemeToken = token.sets[colorScheme];
        return schemeToken ? String(schemeToken.value) : null;
    }

    // Token has no sets, must be a regular token
    if (!("sets" in token)) {
        // Skip complex objects (like drop-shadow)
        if (typeof token.value === "object") {
            return null;
        }
        return String(token.value);
    }

    return null;
}

function isColorToken(schemaUrl: string): boolean {
    const schemaType = schemaUrl.split("/").pop()?.replace(".json", "");
    return schemaType === "color" || schemaType === "alias" || schemaType === "color-set";
}

function buildReferenceMap(): Map<string, string> {
    const allTokensMap = new Map<string, string>();
    for (const filename of COLOR_FILES) {
        const tokens = loadTokenFile(filename);
        for (const [name, tokenValue] of Object.entries(tokens)) {
            const token = tokenValue as SpectrumTokenValue;
            if ("deprecated" in token && token.deprecated) {
                continue;
            }
            const lightValue = extractColorValue(token, "light");
            if (lightValue) {
                allTokensMap.set(name, lightValue);
            }
        }
    }
    return allTokensMap;
}

function generateCSSForFile(filename: string, allTokensMap: Map<string, string>): string {
    const tokens = loadTokenFile(filename);
    const lines: string[] = [];

    // Collect tokens by theme
    const colorsByTheme = {
        light: new Map<string, string>(),
        dark: new Map<string, string>(),
        wireframe: new Map<string, string>(),
    };

    for (const [name, tokenValue] of Object.entries(tokens)) {
        const token = tokenValue as SpectrumTokenValue;

        // Skip deprecated tokens
        if ("deprecated" in token && token.deprecated) {
            continue;
        }

        // Skip non-color tokens (opacity, etc.)
        if (!isColorToken(token.$schema)) {
            continue;
        }

        // Extract values for all themes
        for (const theme of ["light", "dark", "wireframe"] as const) {
            const value = extractColorValue(token, theme);
            if (value) {
                // Convert token references like {blue-800} to var(--blue-800)
                let cssValue: string;
                if (value.startsWith("{") && value.endsWith("}")) {
                    const refName = value.slice(1, -1);
                    cssValue = `var(--${refName})`;
                } else {
                    cssValue = convertColorValue(value);
                }
                colorsByTheme[theme].set(name, cssValue);
            }
        }
    }

    // Generate :root with light mode colors
    lines.push(":root {");
    for (const [name, value] of colorsByTheme.light) {
        lines.push(`    --${name}: ${value};`);
    }
    lines.push("}");
    lines.push("");

    // Generate .dark class - only include tokens that differ from light
    const darkOverrides: string[] = [];
    for (const [name, value] of colorsByTheme.dark) {
        const lightValue = colorsByTheme.light.get(name);
        if (value !== lightValue) {
            darkOverrides.push(`    --${name}: ${value};`);
        }
    }
    if (darkOverrides.length > 0) {
        lines.push(".dark {");
        lines.push(...darkOverrides);
        lines.push("}");
        lines.push("");
    }

    // Generate .wireframe class - only include tokens that differ from light
    const wireframeOverrides: string[] = [];
    for (const [name, value] of colorsByTheme.wireframe) {
        const lightValue = colorsByTheme.light.get(name);
        if (value !== lightValue) {
            wireframeOverrides.push(`    --${name}: ${value};`);
        }
    }
    if (wireframeOverrides.length > 0) {
        lines.push(".wireframe {");
        lines.push(...wireframeOverrides);
        lines.push("}");
    }

    return lines.join("\n");
}

function main() {
    console.log("Loading Spectrum color tokens...");

    // Build complete reference map for all files
    const allTokensMap = buildReferenceMap();

    const outputDir = join(process.cwd(), "dist");
    mkdirSync(outputDir, { recursive: true });

    // Generate separate CSS file for each JSON file
    for (const filename of COLOR_FILES) {
        const css = generateCSSForFile(filename, allTokensMap);
        const cssFilename = filename.replace(".json", ".css");
        const outputPath = join(outputDir, cssFilename);

        writeFileSync(outputPath, css, "utf-8");

        const countTokens = (selector: string): number => {
            const match = css.match(new RegExp(`${selector} \\{([\\s\\S]*?)\\}`));
            if (!match?.[1]) return 0;
            return match[1].split("\n").filter((l) => l.trim().startsWith("--")).length;
        };

        const lightTokens = countTokens(":root");
        const darkTokens = countTokens("\\.dark");
        const wireframeTokens = countTokens("\\.wireframe");

        console.log(`✓ ${cssFilename}`);
        console.log(`  - ${lightTokens} light / ${darkTokens} dark / ${wireframeTokens} wireframe tokens`);
    }

    console.log(`\n✓ All color CSS files generated in: ${outputDir}`);
}

main();
