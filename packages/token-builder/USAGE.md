# Usage Examples

## Basic Setup

### 1. Create your CSS entry file

```css
/* app/globals.css */
@import "@grahamcrackers/ui-tokens/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 2. Use tokens in your components

```tsx
// components/Button.tsx
export function Button({ children }: { children: React.ReactNode }) {
  return (
    <button className="bg-accent-color-900 text-white px-spacing-300 py-spacing-200 rounded-corner-radius-100 font-weight-medium">
      {children}
    </button>
  );
}
```

## Advanced Examples

### Custom Theme Switcher

```tsx
"use client";

import { useEffect, useState } from "react";

export function ThemeSwitcher() {
  const [theme, setTheme] = useState<"light" | "dark" | "auto">("auto");

  useEffect(() => {
    const root = document.documentElement;
    
    if (theme === "auto") {
      root.removeAttribute("data-theme");
    } else {
      root.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <div className="flex gap-spacing-200">
      <button
        onClick={() => setTheme("light")}
        className={theme === "light" ? "font-weight-bold" : ""}
      >
        Light
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={theme === "dark" ? "font-weight-bold" : ""}
      >
        Dark
      </button>
      <button
        onClick={() => setTheme("auto")}
        className={theme === "auto" ? "font-weight-bold" : ""}
      >
        Auto
      </button>
    </div>
  );
}
```

### Using Raw CSS Custom Properties

```tsx
// For cases where you need to use the raw value
export function GradientBox() {
  return (
    <div
      style={{
        background: `linear-gradient(to right, var(--blue-600), var(--purple-600))`,
        padding: "var(--spacing-400)",
        borderRadius: "var(--corner-radius-200)",
      }}
    >
      Gradient Box
    </div>
  );
}
```

### Component Library

```tsx
// components/Card.tsx
interface CardProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="bg-gray-50 border border-gray-300 rounded-corner-radius-200 p-spacing-400">
      <h2 className="text-gray-900 font-weight-bold mb-spacing-200">
        {title}
      </h2>
      <p className="text-gray-700 mb-spacing-300">
        {description}
      </p>
      {children}
    </div>
  );
}
```

### Responsive Design

```tsx
// The tokens work seamlessly with Tailwind's responsive modifiers
export function ResponsiveGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-spacing-300">
      <Card title="Card 1" description="Description" />
      <Card title="Card 2" description="Description" />
      <Card title="Card 3" description="Description" />
    </div>
  );
}
```

## Direct CSS Usage

If you prefer writing CSS, you can use the tokens directly:

```css
/* components/Button.module.css */
.button {
  background-color: var(--accent-color-900);
  color: var(--white);
  padding: var(--spacing-200) var(--spacing-300);
  border-radius: var(--corner-radius-100);
  font-weight: var(--medium-font-weight);
  font-family: var(--sans-serif-font-family);
}

.button:hover {
  background-color: var(--accent-color-1000);
}

.button:disabled {
  opacity: var(--opacity-disabled);
}
```

## TypeScript Support

For better type safety, you can create a tokens helper:

```typescript
// lib/tokens.ts
export const tokens = {
  colors: {
    gray: {
      50: "var(--gray-50)",
      100: "var(--gray-100)",
      // ... etc
    },
  },
  spacing: {
    50: "var(--spacing-50)",
    100: "var(--spacing-100)",
    // ... etc
  },
} as const;

// Usage
import { tokens } from "@/lib/tokens";

const styles = {
  color: tokens.colors.gray[900],
  padding: tokens.spacing[300],
};
```

## Best Practices

1. **Use Semantic Colors**: Prefer using semantic color tokens (e.g., `accent-color-*`, `informative-color-*`) over raw palette colors when appropriate, as they automatically adapt to themes.

2. **Consistent Spacing**: Use the spacing scale consistently throughout your application for a cohesive look.

3. **Theme Awareness**: Design components that work well in both light and dark modes by testing with both themes.

4. **Component Composition**: Build reusable components that use tokens internally, then compose them into larger features.

5. **CSS Custom Properties**: For dynamic values or calculations, use CSS custom properties directly rather than trying to compute them in JavaScript.


