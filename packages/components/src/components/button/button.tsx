"use client";


import { type VariantProps } from "class-variance-authority";
import { Button as RACButton, composeRenderProps, type ButtonProps as RACButtonProps } from "react-aria-components";

import { buttonVariants } from "./button.variants";

import { cn } from "../../utils/cn";

export type ButtonProps = VariantProps<typeof buttonVariants> & RACButtonProps;

export function Button({
    className,
    variant,
    fill,
    size,
    staticColor,
    ...props
}: ButtonProps & RACButtonProps) {
    return (
        <RACButton
            className={composeRenderProps(className, (className) =>
                cn(buttonVariants({ variant, fill, size, className, staticColor })),
            )}
            {...props}
        />
    );
}
