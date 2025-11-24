import type { Meta, StoryObj } from "@storybook/react-vite";

import { Button, type ButtonProps } from "@grahamcrackers/components";
import { fn } from "storybook/test";



// More on how to set up stories at: https://storybook.js.org/docs/writing-stories#default-export
const meta = {
    title: "Components/Button",
    component: Button,
    parameters: {
        // Optional parameter to center the component in the Canvas. More info: https://storybook.js.org/docs/configure/story-layout
        layout: "centered",
    },
    // This component will have an automatically generated Autodocs entry: https://storybook.js.org/docs/writing-docs/autodocs
    tags: ["autodocs"],
    // Use `fn` to spy on the onClick arg, which will appear in the actions panel once invoked: https://storybook.js.org/docs/essentials/actions#action-args
    args: {
        variant: "primary",
        size: "md",
        fill: "fill",
        onClick: fn(),
    },
    argTypes: {
        variant: {
            control: "select",
            options: ["primary", "secondary", "accent", "negative"],
        },
        fill: {
            control: "select",
            options: ["fill", "outline"],
        },
        size: {
            control: "select",
            options: ["sm", "md", "lg", "xl"],
        },
    }
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// More on writing stories with args: https://storybook.js.org/docs/writing-stories/args
export const Primary: Story = {
    render: (props: ButtonProps) => (
        <Button
            {...props}
            onClick={(): void => {
                setTimeout(() => alert("Hello from Storybook!"), 1);
            }}
        />
    ),
    args: {
        children: "Label",
    },
};
