# Architecture & Implementation

## Overview

This package converts Adobe Spectrum Design Tokens from JSON format to a Tailwind CSS v4 compatible theme using CSS custom properties and the `@theme` directive.

## File Structure

```
packages/tokens/
├── src/
│   ├── token-types.ts       # TypeScript type definitions
│   ├── utils.ts             # Utility functions (px to rem conversion)
│   ├── converters.ts        # Token conversion and processing logic
│   ├── generate-theme.ts    # Main theme generation script
│   └── index.ts            # Package exports
├── dist/
│   └── spectrum-theme.css   # Generated theme file
├── package.json
├── tsconfig.json
├── README.md
├── USAGE.md
└── ARCHITECTURE.md (this file)
```

## Conversion Process

### 1. Token Loading (`loadTokenFile`)

Loads JSON token files from `@adobe/spectrum-tokens/src`:
- `color-palette.json` - Base color palette
- `semantic-color-palette.json` - Semantic color mappings
- `color-component.json` - Component-specific colors
- `color-aliases.json` - Color aliases
- `layout.json` - Spacing and sizing tokens
- `layout-component.json` - Component-specific layout
- `typography.json` - Typography tokens

### 2. Token Processing (`processTokens`)

Processes tokens in multiple passes:

**First Pass: Build Reference Map**
- Loads all tokens from JSON files
- Skips deprecated tokens
- Builds a complete map of token names to values for reference resolution
- Includes private tokens in the map (they're needed for references)

**Second Pass: Categorize Tokens**
- Separates tokens into categories:
  - Colors
  - Spacing
  - Border Radius
  - Typography (font-size, font-weight, font-family, line-height, letter-spacing)
  - Opacity
  - Box Shadow

**Third Pass: Handle Color Schemes**
- Extracts tokens with light/dark/wireframe sets
- Creates separate maps for each color scheme
- Resolves references to other tokens

### 3. Token Conversion

#### Value Conversion

**Dimensions** (`convertDimensionValue`)
- Converts pixel values to rem: `16px` → `1rem`
- Uses 16px as the base (standard browser default)
- Preserves 0 values without units

**Colors** (`convertColorValue`)
- Converts to modern CSS color syntax:
  - `rgb(255, 255, 255)` → `rgb(255 255 255)`
  - `rgba(255, 255, 255, 0.5)` → `rgb(255 255 255 / 0.5)`

**Font Weights** (`getFontWeightValue`)
- Converts named weights to numeric values:
  - `light` → `300`
  - `regular` → `400`
  - `medium` → `500`
  - `bold` → `700`
  - etc.

**Token References** (`resolveTokenReference`)
- Recursively resolves references like `{blue-800}`
- Uses the complete token map to find referenced values
- Warns when references can't be resolved

#### Name Conversion

Token names are converted to CSS custom property format:
- `spacing-100` → `--spacing-100`
- `corner-radius-full` → `--corner-radius-full`
- `gray-800` → `--gray-800`

### 4. CSS Generation (`generateCSSTheme`)

Generates the final CSS file with multiple sections:

```css
@theme {
  /* Base tokens available in all themes */
  --spacing-100: 0.5rem;
  --corner-radius-100: 0.25rem;
  /* ... */
}

@media (prefers-color-scheme: light) {
  :root {
    /* Auto light mode tokens */
    --gray-100: rgb(233 233 233);
    /* ... */
  }
}

@media (prefers-color-scheme: dark) {
  :root {
    /* Auto dark mode tokens */
    --gray-100: rgb(44 44 44);
    /* ... */
  }
}

[data-theme="light"] {
  /* Manual light mode override */
  --gray-100: rgb(233 233 233);
  /* ... */
}

[data-theme="dark"] {
  /* Manual dark mode override */
  --gray-100: rgb(44 44 44);
  /* ... */
}
```

## Key Design Decisions

### 1. Include Private Tokens

While Adobe marks some tokens as "private", we include them in the reference map because other tokens depend on them. However, we only output non-private tokens as base theme tokens (color scheme tokens are always output regardless of private status).

### 2. Skip Complex Values

Tokens with complex values (objects, arrays) are skipped as they don't have a direct CSS custom property representation. These are typically composite values that need special handling.

### 3. Dual Theme Support

The generated CSS supports both:
- **Automatic**: Uses `@media (prefers-color-scheme)` to auto-detect system theme
- **Manual**: Uses `data-theme` attribute for explicit control

This provides maximum flexibility for consumers.

### 4. Rem-Based Spacing

All spacing values are converted to rem units for:
- Better accessibility (respects user font size preferences)
- Consistent scaling across the application
- Alignment with modern CSS best practices

### 5. Modern CSS Color Syntax

Uses the space-separated syntax for better readability and future-proofing:
- Easier to work with in CSS calculations
- More compact than comma-separated
- Better tooling support in modern browsers

## Tailwind CSS v4 Integration

### The `@theme` Directive

Tailwind CSS v4 introduces the `@theme` directive which:
- Defines CSS custom properties that Tailwind recognizes
- Auto-generates utility classes from these properties
- Eliminates the need for a JavaScript config file

### Utility Class Generation

With our tokens, Tailwind automatically generates utilities like:
- `bg-gray-100` from `--gray-100`
- `p-spacing-300` from `--spacing-300`
- `rounded-corner-radius-100` from `--corner-radius-100`

### Direct Property Access

Tokens are also available as CSS custom properties:
```css
.custom {
  color: var(--gray-900);
  padding: var(--spacing-200);
}
```

## Performance Considerations

### Build Time

The conversion script:
- Processes ~7 JSON files
- Handles ~800+ tokens
- Resolves ~400+ color scheme variants
- Generates ~2000 lines of CSS
- Completes in <1 second

### Runtime

The generated CSS:
- Uses native CSS custom properties (no runtime overhead)
- Leverages browser-native color scheme detection
- Minimal file size (~100KB uncompressed, ~15KB gzipped)

## Future Enhancements

Potential improvements:

1. **Token Filtering**: Option to include/exclude specific token categories
2. **Custom Transformations**: User-defined value transformations
3. **Alternative Formats**: Generate for other CSS frameworks
4. **Token Documentation**: Auto-generate token reference docs
5. **Tree Shaking**: Only include used tokens (requires build-time analysis)
6. **Validation**: Verify token references are valid
7. **Icon Tokens**: Handle icon size tokens specially
8. **Box Shadow Composition**: Better handling of composite shadow values

## Maintenance

### Updating Tokens

To update to a new version of Spectrum tokens:

1. Update the `@adobe/spectrum-tokens` dependency
2. Run `pnpm build` to regenerate the theme
3. Review warnings for any new missing references
4. Test the generated CSS with your application

### Adding New Token Files

To include additional token files:

1. Add the filename to `TOKEN_FILES` array in `generate-theme.ts`
2. Run the build script
3. Verify the output

### Customizing Conversion

To customize how tokens are converted:

1. Modify converter functions in `converters.ts`
2. Update the category mapping in `determineTokenCategory`
3. Adjust value transformations as needed

## Testing

Recommended testing approach:

1. **Visual Regression**: Compare rendered components before/after token updates
2. **Build Verification**: Ensure the CSS generates without errors
3. **Reference Resolution**: Verify no missing token references (check warnings)
4. **Theme Switching**: Test light/dark/auto modes work correctly
5. **Utility Classes**: Verify Tailwind generates expected utilities


