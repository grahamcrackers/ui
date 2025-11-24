# @grahamcrackers/ui-tokens

Adobe Spectrum Design Tokens converted to Tailwind CSS v4 theme.

## Overview

This package provides a comprehensive set of design tokens from Adobe's Spectrum design system, converted into a format compatible with Tailwind CSS v4. The tokens include:

- **Colors**: Complete color palette with light/dark mode support (414 tokens per mode)
- **Spacing**: Comprehensive spacing scale (256 tokens)
- **Border Radius**: Corner radius tokens (30 tokens)
- **Typography**: Font families, weights, sizes, and line heights
- **Opacity**: Transparency values
- **Layout**: Component-specific spacing and dimensions

## Installation

```bash
pnpm add @grahamcrackers/ui-tokens
```

## Usage

### With Tailwind CSS v4

Import the theme in your main CSS file:

```css
@import "@grahamcrackers/ui-tokens/theme.css";

@tailwind base;
@tailwind components;
@tailwind utilities;
```

The theme uses CSS custom properties that are automatically picked up by Tailwind CSS v4. All tokens are available as utility classes.

### Color Modes

The theme supports multiple color schemes:

1. **Auto (System Preference)**: Uses `@media (prefers-color-scheme)` to automatically switch between light and dark modes
2. **Manual Control**: Use `data-theme="light"` or `data-theme="dark"` attributes on your root element

```html
<!-- Auto mode (respects system preference) -->
<html>
  <body>
    <!-- Your app -->
  </body>
</html>

<!-- Manual light mode -->
<html data-theme="light">
  <body>
    <!-- Your app in light mode -->
  </body>
</html>

<!-- Manual dark mode -->
<html data-theme="dark">
  <body>
    <!-- Your app in dark mode -->
  </body>
</html>
```

### Using Tokens in Your Styles

All tokens are available as CSS custom properties:

```css
.my-component {
  background-color: var(--gray-100);
  padding: var(--spacing-300);
  border-radius: var(--corner-radius-100);
  font-weight: var(--regular-font-weight);
}
```

### Using with Tailwind Utilities

Since Tailwind CSS v4 automatically generates utilities from custom properties, you can use tokens directly in your classes:

```html
<!-- Using color tokens -->
<div class="bg-gray-100 text-gray-900">
  Content
</div>

<!-- Using spacing tokens -->
<div class="p-spacing-300 m-spacing-200">
  Content
</div>

<!-- Using border radius tokens -->
<div class="rounded-corner-radius-100">
  Content
</div>
```

## Token Categories

### Colors

The color palette includes semantic colors that adapt to light and dark modes:

- `gray-*` (25, 50, 75, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000)
- `blue-*`, `red-*`, `orange-*`, `yellow-*`, `green-*`, etc.
- `accent-color-*`, `informative-color-*`, `negative-color-*`, `positive-color-*`
- Component-specific colors

### Spacing

Spacing tokens use a consistent scale:

- `spacing-50` (0.125rem / 2px)
- `spacing-75` (0.25rem / 4px)
- `spacing-100` (0.5rem / 8px)
- `spacing-200` (0.75rem / 12px)
- `spacing-300` (1rem / 16px)
- And more...

### Border Radius

- `corner-radius-0` through `corner-radius-800`
- `corner-radius-full` for fully rounded elements
- Size-specific variants for different component sizes

### Typography

- Font families: `sans-serif-font-family`, `serif-font-family`, `code-font-family`
- Font weights: `light-font-weight`, `regular-font-weight`, `medium-font-weight`, `bold-font-weight`
- Component-specific font sizes and line heights

## Building

To regenerate the theme from the source Adobe Spectrum tokens:

```bash
pnpm build
```

This will:
1. Load tokens from `@adobe/spectrum-tokens`
2. Process and convert them to Tailwind CSS v4 format
3. Generate `dist/spectrum-theme.css`

## Source

Tokens are sourced from [`@adobe/spectrum-tokens`](https://www.npmjs.com/package/@adobe/spectrum-tokens), Adobe's official design token package.

## License

MIT


