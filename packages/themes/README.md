# `@grahamcrackers/ui-themes`

Install [tailwindcss](https://tailwindcss.com/) v4.1+ and [configure it with your specific framework](https://tailwindcss.com/docs/installation/using-vite) import the theme with your css.

```zsh
pnpm add -D tailwindcss tw-animate-css @@grahamcrackers/ui-themes
```

Add the theme to your global css file, usually named `index.css` or `global.css`

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@@grahamcrackers/ui-themes";

@source "@grahamcrackers/components";
```
