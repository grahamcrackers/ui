# Next.js App Router Example

This example shows how to use the tokens in a Next.js application with the App Router.

## Setup

### 1. Install the package

```bash
pnpm add @grahamcrackers/ui-tokens
```

### 2. Import the theme in your global CSS

```css
/* app/globals.css */
@import "@grahamcrackers/ui-tokens/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Optional: Add your custom styles */
@layer components {
  .btn-primary {
    @apply bg-accent-color-900 text-white;
    @apply px-spacing-300 py-spacing-200;
    @apply rounded-corner-radius-100;
    @apply font-weight-medium;
    @apply transition-colors;
  }
  
  .btn-primary:hover {
    @apply bg-accent-color-1000;
  }
  
  .btn-primary:disabled {
    opacity: var(--opacity-disabled);
  }
}
```

### 3. Import in your root layout

```tsx
// app/layout.tsx
import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
```

## Theme Switcher Component

```tsx
// components/theme-switcher.tsx
"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("system");

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "system") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
    
    // Persist preference
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem("theme") as Theme | null;
    if (saved) {
      setTheme(saved);
    }
  }, []);

  return (
    <div className="flex gap-spacing-100 p-spacing-200 bg-gray-100 rounded-corner-radius-100">
      <button
        onClick={() => setTheme("light")}
        className={`px-spacing-200 py-spacing-100 rounded-corner-radius-75 ${
          theme === "light"
            ? "bg-accent-color-900 text-white"
            : "bg-transparent text-gray-700"
        }`}
      >
        ☀️ Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`px-spacing-200 py-spacing-100 rounded-corner-radius-75 ${
          theme === "dark"
            ? "bg-accent-color-900 text-white"
            : "bg-transparent text-gray-700"
        }`}
      >
        🌙 Dark
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`px-spacing-200 py-spacing-100 rounded-corner-radius-75 ${
          theme === "system"
            ? "bg-accent-color-900 text-white"
            : "bg-transparent text-gray-700"
        }`}
      >
        💻 System
      </button>
    </div>
  );
}
```

## Example Components

### Card Component

```tsx
// components/card.tsx
interface CardProps {
  title: string;
  description: string;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}

export function Card({ title, description, footer, children }: CardProps) {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-corner-radius-200 overflow-hidden">
      <div className="p-spacing-400">
        <h3 className="text-gray-900 font-weight-bold mb-spacing-200">
          {title}
        </h3>
        <p className="text-gray-700 mb-spacing-300">
          {description}
        </p>
        {children}
      </div>
      {footer && (
        <div className="bg-gray-100 px-spacing-400 py-spacing-300 border-t border-gray-300">
          {footer}
        </div>
      )}
    </div>
  );
}
```

### Button Component

```tsx
// components/button.tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger";
  size?: "small" | "medium" | "large";
  children: React.ReactNode;
}

export function Button({ 
  variant = "primary", 
  size = "medium",
  children,
  className = "",
  ...props 
}: ButtonProps) {
  const baseClasses = "rounded-corner-radius-100 font-weight-medium transition-colors";
  
  const variantClasses = {
    primary: "bg-accent-color-900 hover:bg-accent-color-1000 text-white",
    secondary: "bg-gray-200 hover:bg-gray-300 text-gray-900",
    danger: "bg-negative-color-900 hover:bg-negative-color-1000 text-white",
  };
  
  const sizeClasses = {
    small: "px-spacing-200 py-spacing-100 text-sm",
    medium: "px-spacing-300 py-spacing-200",
    large: "px-spacing-400 py-spacing-300 text-lg",
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Input Component

```tsx
// components/input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className = "", ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-spacing-100">
      {label && (
        <label className="text-gray-900 font-weight-medium text-sm">
          {label}
        </label>
      )}
      <input
        className={`
          px-spacing-300 py-spacing-200
          bg-gray-50 border border-gray-300
          rounded-corner-radius-100
          text-gray-900
          placeholder:text-gray-500
          focus:outline-none focus:ring-2 focus:ring-accent-color-900
          disabled:opacity-[var(--opacity-disabled)]
          ${error ? "border-negative-color-900" : ""}
          ${className}
        `}
        {...props}
      />
      {error && (
        <span className="text-negative-color-900 text-sm">
          {error}
        </span>
      )}
    </div>
  );
}
```

## Example Page

```tsx
// app/page.tsx
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Card } from "@/components/card";
import { Button } from "@/components/button";
import { Input } from "@/components/input";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-25 p-spacing-500">
      <div className="max-w-4xl mx-auto">
        <header className="mb-spacing-500">
          <h1 className="text-4xl font-weight-bold text-gray-900 mb-spacing-200">
            Spectrum Tokens Example
          </h1>
          <p className="text-gray-700 mb-spacing-400">
            This page demonstrates the Adobe Spectrum design tokens converted
            to Tailwind CSS v4.
          </p>
          <ThemeSwitcher />
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-spacing-400 mb-spacing-500">
          <Card
            title="Card Example"
            description="This card uses Spectrum spacing and color tokens"
            footer={
              <div className="flex gap-spacing-200">
                <Button size="small">Action</Button>
                <Button variant="secondary" size="small">
                  Cancel
                </Button>
              </div>
            }
          >
            <p className="text-gray-600 text-sm">
              Additional card content goes here
            </p>
          </Card>

          <Card
            title="Form Example"
            description="Inputs and buttons with token-based styling"
          >
            <div className="space-y-spacing-300">
              <Input label="Email" type="email" placeholder="you@example.com" />
              <Input label="Password" type="password" />
              <Button className="w-full">Sign In</Button>
            </div>
          </Card>
        </div>

        <section className="bg-white rounded-corner-radius-200 p-spacing-500 border border-gray-200">
          <h2 className="text-2xl font-weight-bold text-gray-900 mb-spacing-300">
            Button Variants
          </h2>
          <div className="flex flex-wrap gap-spacing-200">
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </div>
          
          <h3 className="text-xl font-weight-bold text-gray-900 mt-spacing-400 mb-spacing-300">
            Button Sizes
          </h3>
          <div className="flex flex-wrap items-center gap-spacing-200">
            <Button size="small">Small</Button>
            <Button size="medium">Medium</Button>
            <Button size="large">Large</Button>
          </div>
        </section>
      </div>
    </main>
  );
}
```

## Tailwind Configuration

For Tailwind CSS v4, you typically don't need a config file, but if you want to extend or customize:

```js
// tailwind.config.js (optional)
export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Tailwind v4 automatically picks up CSS variables from @theme
};
```

## Notes

1. The theme automatically adapts to system preferences unless you use `data-theme` attribute
2. All spacing values are in rem for better accessibility
3. Color tokens automatically switch between light and dark modes
4. You can mix token-based classes with regular Tailwind utilities


