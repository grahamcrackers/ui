import { cva } from "class-variance-authority";

// for only icons, this should work [&:has(svg:only-child)]:min-w-auto

/**
 * Button variants based on Spectrum 2 design system
 * Sizes: S, M (default), L, XL
 * Variants: Primary, Secondary, Accent, Negative
 * Styles: Fill (default), Outline
 * Static: White, Black, Auto (for overlays)
 */
export const buttonVariants = cva(
    [
        // defaults
        "relative inline-flex items-center justify-center gap-1.5 font-medium rounded-full outline-none select-none",
        // focus ring
        "ring-ring focus-visible:ring-2 focus-visible:ring-offset-2",
        // disabled
        "data-disabled:pointer-events-none data-disabled:bg-disabled data-disabled:text-disabled-foreground",
        // pending
        "data-pending:bg-disabled",
        // svg
        "[&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-5 shrink-0 [&_svg]:shrink-0",
        // icon only
        "[&:has(>svg:only-child)]:min-w-auto",
        // micro animations
        "transition-all active:scale-[0.98] duration-75 ease-out disabled:active:scale-100",
    ],
    {
        variants: {
            variant: {
                primary: "bg-primary text-gray-25",
                secondary: "bg-secondary text-secondary-foreground font-bold",
                accent: "bg-accent text-white",
                negative: "bg-negative text-white",
                // premium: "",
                // genai: "",
            },
            fill: {
                fill: "",
                outline: "border-2 bg-transparent font-semibold",
            },
            size: {
                sm: "h-6 min-w-13.5 text-xs px-3 py-1 [&:has(svg:only-child)]:w-6",
                md: "h-8 min-w-18 text-sm px-4 py-[7px] [&:has(svg:only-child)]:w-8",
                lg: "h-10 min-w-22.5 text-base px-5 py-[10px] [&:has(svg:only-child)]:w-10",
                xl: "h-12 min-w-27 text-lg px-6 py-[13px] [&:has(svg:only-child)]:w-12",
            },
            isPending: {
                true: "bg-disabled",
            },
            staticColor: {
                white: "bg-white-800 text-black",
                black: "bg-black-800 text-white",
            },
        },
        compoundVariants: [
            {
                variant: "primary",
                fill: "outline",
                className: "text-gray-800",
            },
            {
                variant: "secondary",
                fill: "outline",
                className: "border-secondary text-secondary-foreground",
            },
            // we really don't have outlines for accent and negatives ????
            // static white primary outline
            {
                variant: "primary",
                staticColor: "white",
                fill: "outline",
                className: "bg-transparent border-white-800 text-white-800",
            },
            // static white secondary
            {
                variant: "secondary",
                staticColor: "white",
                fill: "fill",
                className: "bg-white-100 text-white-800",
            },
            {
                variant: "secondary",
                staticColor: "white",
                fill: "outline",
                className: "bg-transparent border-white-100 text-white-800",
            },
            // static black primary outline
            {
                variant: "primary",
                staticColor: "black",
                fill: "outline",
                className: "bg-transparent border-black-800 text-black-800",
            },
            // static white secondary
            {
                variant: "secondary",
                staticColor: "black",
                fill: "fill",
                className: "bg-black-100 text-black-800",
            },
            {
                variant: "secondary",
                staticColor: "black",
                fill: "outline",
                className: "bg-transparent border-black-100 text-black-800",
            },
        ],
        defaultVariants: {
            variant: "primary",
            fill: "fill",
            size: "md",
        },
    },
);
