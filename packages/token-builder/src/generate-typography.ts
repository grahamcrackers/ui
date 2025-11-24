import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { convertDimensionValue, getFontWeightValue, resolveTokenReference } from "./converters";
import type { SpectrumTokens, SpectrumTokenValue, SpectrumTokenWithScaleSets } from "./token-types";

const SPECTRUM_TOKENS_PATH = join(process.cwd(), "node_modules", "@adobe", "spectrum-tokens", "src");

function loadTokenFile(filename: string): SpectrumTokens {
    const filePath = join(SPECTRUM_TOKENS_PATH, filename);
    const content = readFileSync(filePath, "utf-8");
    return JSON.parse(content);
}

function hasScaleSets(token: SpectrumTokenValue): token is SpectrumTokenWithScaleSets {
    return "sets" in token && token.$schema.includes("scale-set.json");
}

function extractTypographyValue(token: SpectrumTokenValue, scale: "desktop" | "mobile" = "desktop"): string | null {
    if (hasScaleSets(token)) {
        const scaleToken = token.sets[scale];
        return scaleToken ? String(scaleToken.value) : null;
    }

    // Token has no sets, must be a regular token
    if (!("sets" in token)) {
        // Skip complex objects
        if (typeof token.value === "object") {
            return null;
        }
        return String(token.value);
    }

    return null;
}

function isTypographyToken(schemaUrl: string): boolean {
    const schemaType = schemaUrl.split("/").pop()?.replace(".json", "");
    return (
        schemaType === "font-family" ||
        schemaType === "font-size" ||
        schemaType === "font-weight" ||
        schemaType === "font-style" ||
        schemaType === "dimension" ||
        schemaType === "text-align" ||
        schemaType === "alias" ||
        schemaType === "scale-set"
    );
}

function convertTypographyValue(value: string, schemaUrl: string): string {
    const schemaType = schemaUrl.split("/").pop()?.replace(".json", "");

    // Convert font weights
    if (schemaType === "font-weight") {
        return getFontWeightValue(value);
    }

    // Convert any px values to rem (font sizes, line heights, etc.)
    if (value.endsWith("px")) {
        return convertDimensionValue(value);
    }

    // Return as-is for font families, styles, etc.
    return value;
}

function buildReferenceMap(): Map<string, string> {
    const allTokensMap = new Map<string, string>();
    const tokens = loadTokenFile("typography.json");

    for (const [name, tokenValue] of Object.entries(tokens)) {
        const token = tokenValue as SpectrumTokenValue;
        if ("deprecated" in token && token.deprecated) {
            continue;
        }
        const desktopValue = extractTypographyValue(token, "desktop");
        if (desktopValue) {
            allTokensMap.set(name, desktopValue);
        }
    }

    return allTokensMap;
}

function generateTypographyCSS(allTokensMap: Map<string, string>): string {
    const tokens = loadTokenFile("typography.json");
    const lines: string[] = [];

    // Collect tokens by scale
    const tokensByScale = {
        desktop: new Map<string, string>(),
        mobile: new Map<string, string>(),
    };

    for (const [name, tokenValue] of Object.entries(tokens)) {
        const token = tokenValue as SpectrumTokenValue;

        // Skip deprecated tokens
        if ("deprecated" in token && token.deprecated) {
            continue;
        }

        // Skip non-typography tokens
        if (!isTypographyToken(token.$schema)) {
            continue;
        }

        // Extract values for all scales
        for (const scale of ["desktop", "mobile"] as const) {
            const value = extractTypographyValue(token, scale);
            if (value) {
                // Resolve token references like {sans-serif-font-family}
                const resolvedValue = resolveTokenReference(value, allTokensMap);
                const cssValue = convertTypographyValue(resolvedValue, token.$schema);
                tokensByScale[scale].set(name, cssValue);
            }
        }
    }

    // Generate :root with desktop values (default)
    lines.push(":root {");
    for (const [name, value] of tokensByScale.desktop) {
        lines.push(`    --${name}: ${value};`);
    }
    lines.push("}");
    lines.push("");

    // Generate .mobile class - only include tokens that differ from desktop
    const mobileOverrides: string[] = [];
    for (const [name, value] of tokensByScale.mobile) {
        const desktopValue = tokensByScale.desktop.get(name);
        if (value !== desktopValue) {
            mobileOverrides.push(`    --${name}: ${value};`);
        }
    }
    if (mobileOverrides.length > 0) {
        lines.push(".mobile {");
        lines.push(...mobileOverrides);
        lines.push("}");
    }

    return lines.join("\n");
}

function main() {
    console.log("Loading Spectrum typography tokens...");

    // Build complete reference map
    const allTokensMap = buildReferenceMap();

    const outputDir = join(process.cwd(), "dist");
    mkdirSync(outputDir, { recursive: true });

    // Generate CSS
    const css = generateTypographyCSS(allTokensMap);
    const outputPath = join(outputDir, "typography.css");

    writeFileSync(outputPath, css, "utf-8");

    const countTokens = (selector: string): number => {
        const match = css.match(new RegExp(`${selector} \\{([\\s\\S]*?)\\}`));
        if (!match?.[1]) return 0;
        return match[1].split("\n").filter((l) => l.trim().startsWith("--")).length;
    };

    const desktopTokens = countTokens(":root");
    const mobileTokens = countTokens("\\.mobile");

    console.log(`✓ typography.css`);
    console.log(`  - ${desktopTokens} desktop tokens`);
    console.log(`  - ${mobileTokens} mobile-specific overrides`);
    console.log(`\n✓ Typography CSS generated in: ${outputDir}`);
}

main();
