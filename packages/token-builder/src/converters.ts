import type { SpectrumTokenValue, SpectrumTokenWithSets } from "./token-types";
import { pxToRem } from "./utils";

export function hasTokenSets(token: SpectrumTokenValue): token is SpectrumTokenWithSets {
    return "sets" in token && typeof token.sets === "object";
}

export function resolveTokenReference(value: string, allTokens: Map<string, string>): string {
    const match = value.match(/^\{(.+)\}$/);
    if (!match) {
        return value;
    }

    const referencedToken = match[1];
    if (!referencedToken) {
        return value;
    }

    const resolvedValue = allTokens.get(referencedToken);

    if (!resolvedValue) {
        // Convert unresolved token reference to CSS variable syntax
        return `var(--${referencedToken})`;
    }

    return resolveTokenReference(resolvedValue, allTokens);
}

export function convertDimensionValue(value: string | number, convertToRem = true): string {
    const stringValue = String(value);

    if (!convertToRem) {
        return stringValue;
    }

    const match = stringValue.match(/^(-?[\d.]+)px$/);
    if (match && match[1]) {
        const numericValue = parseFloat(match[1]);
        return numericValue === 0 ? "0" : pxToRem(numericValue);
    }

    return stringValue;
}

export function convertColorValue(value: string): string {
    // Convert rgba to rgb with alpha syntax
    const rgbaMatch = value.match(/^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
    if (rgbaMatch) {
        return `rgb(${rgbaMatch[1]}, ${rgbaMatch[2]}, ${rgbaMatch[3]}, ${rgbaMatch[4]})`;
    }

    // Keep rgb as-is with commas
    return value;
}

export function getFontWeightValue(value: string): string {
    const fontWeightMap: Record<string, string> = {
        thin: "100",
        "extra-light": "200",
        light: "300",
        regular: "400",
        normal: "400",
        medium: "500",
        "semi-bold": "600",
        bold: "700",
        "extra-bold": "800",
        black: "900",
        heavy: "900",
    };

    return fontWeightMap[value.toLowerCase()] ?? value;
}

export function convertTokenName(name: string): string {
    return name.replace(/-/g, "-");
}

export function determineTokenCategory(schemaUrl: string, tokenName: string): string {
    const schemaType = schemaUrl.split("/").pop()?.replace(".json", "");

    const categoryMap: Record<string, string> = {
        color: "colors",
        dimension: "spacing",
        "font-family": "fontFamily",
        "font-weight": "fontWeight",
        "font-size": "fontSize",
        "line-height": "lineHeight",
        opacity: "opacity",
        alias: "alias",
    };

    if (tokenName.includes("corner-radius") || tokenName.includes("radius")) {
        return "borderRadius";
    }

    if (tokenName.includes("letter-spacing")) {
        return "letterSpacing";
    }

    if (tokenName.includes("shadow")) {
        return "boxShadow";
    }

    return categoryMap[schemaType ?? ""] ?? "other";
}
