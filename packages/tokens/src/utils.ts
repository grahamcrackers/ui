export function pxToRem(px: string | number) {
    if (typeof px === "string") {
        px = parseFloat(px);
    }
    return px / 16 + "rem";
}
