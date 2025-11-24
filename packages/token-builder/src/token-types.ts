export interface SpectrumToken {
    $schema: string;
    value: string | number;
    uuid: string;
    private?: boolean;
    deprecated?: boolean;
    deprecated_comment?: string;
}

export interface SpectrumTokenWithSets {
    $schema: string;
    uuid: string;
    sets: {
        light?: SpectrumToken;
        dark?: SpectrumToken;
        darkest?: SpectrumToken;
        wireframe?: SpectrumToken;
    };
}

export interface SpectrumTokenWithScaleSets {
    $schema: string;
    uuid: string;
    sets: {
        desktop?: SpectrumToken;
        mobile?: SpectrumToken;
    };
}

export type SpectrumTokenValue = SpectrumToken | SpectrumTokenWithSets | SpectrumTokenWithScaleSets;

export interface SpectrumTokens {
    [key: string]: SpectrumTokenValue;
}

export interface TailwindTheme {
    colors: Record<string, string>;
    spacing: Record<string, string>;
    borderRadius: Record<string, string>;
    fontSize: Record<string, string>;
    fontWeight: Record<string, string>;
    fontFamily: Record<string, string>;
    lineHeight: Record<string, string>;
    letterSpacing: Record<string, string>;
    opacity: Record<string, string>;
    boxShadow: Record<string, string>;
}


