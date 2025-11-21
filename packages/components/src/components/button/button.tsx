"use client";

import { cn } from "@/utils/cn";

import { type VariantProps } from "class-variance-authority";
import type { ReactNode } from "react";
import { Button as RACButton, composeRenderProps, type ButtonProps as RACButtonProps } from "react-aria-components";

import { buttonVariants } from "./button.variants";

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
    isPending?: boolean;
    /**
     * Optional icon to display before the label
     */
    icon?: ReactNode;
}

export function Button({
    className,
    variant,
    fill,
    size,
    isPending,
    staticColor,

    ...props
}: ButtonProps & RACButtonProps) {
    return (
        <RACButton
            className={composeRenderProps(className, (className) =>
                cn(buttonVariants({ variant, fill, size, className, staticColor })),
            )}
            {...props}
            isPending={isPending}
            isDisabled={isPending || props.isDisabled}
        >

        </RACButton>
    );
}
