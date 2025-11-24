// borrowed from https://github.com/adobe/spectrum-tokens/blob/main/packages/tokens/tokens.ts

import tokens from "@adobe/spectrum-tokens/dist/json/variables.json" with { type: "json" };
import assert from "node:assert";

export function getToken(name: keyof typeof tokens): string {
    return (tokens[name] as any).value;
}

export function shadowToken(name: "drop-shadow-emphasized" | "drop-shadow-elevated" | "drop-shadow-dragged"): string[] {
    let token = tokens[name];

    return token.value.map((layer) => {
        // Spread must also be zero, since filter: drop-shadow() does not support it.
        assert.equal(layer.spread, "0px");
        return `${layer.x} ${layer.y} ${layer.blur} light-dark(${layer.color.sets.light.value}, ${layer.color.sets.dark.value})`;
    });
}

const emphasized = shadowToken("drop-shadow-emphasized").join(", ");
const elevated = shadowToken("drop-shadow-elevated").join(", ");
const dragged = shadowToken("drop-shadow-dragged").join(", ");
