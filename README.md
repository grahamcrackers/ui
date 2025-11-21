# continuum-ui

[S2][s2-docs] + [react-aria-components][rac] + [tailwindcss][tw]

## Resources

- [S2 documentation][s2-docs]
- [Figma designs][figma]
- [`@react-spectrum/s2`][react-s2]
- [`@react-spectrum/s2` storybook][s2-storybook]
- [tailwindcss v4][tw]

[s2-docs]: https://s2.spectrum.corp.adobe.com
[figma]: https://www.figma.com/design/Mngz9H7WZLbrCvGQf3GnsY/S2---Desktop?m=auto&node-id=0-1
[react-s2]: https://github.com/adobe/react-spectrum/tree/main/packages/%40react-spectrum/s2
[s2-storybook]: https://react-spectrum.adobe.com/s2/index.html?path=/
[rac]: https://react-spectrum.adobe.com/react-aria/components.html
[tw]: https://tailwindcss.com/docs/perspective

## UI Components

### Forms & Input Components

| Component         | Continuum UI | S2 Styles | Animations |
| ----------------- | :----------: | :-------: | :--------: |
| Button            |      ✓       |     -     |     -      |
| ToggleButton      |      ✓       |     -     |     -      |
| ToggleButtonGroup |      ✓       |     -     |     -      |
| TextField         |      ✓       |     -     |     -      |
| SearchField       |      ✓       |     -     |     -      |
| NumberField       |      ✓       |     -     |     -      |
| Checkbox          |      ✓       |     -     |     -      |
| CheckboxGroup     |      ✓       |     -     |     -      |
| RadioGroup        |      ✓       |     -     |     -      |
| Switch            |      ✓       |     -     |     -      |
| Slider            |      ✓       |     -     |     -      |
| Form              |      ✓       |     -     |     -      |
| Field             |      ✓       |     -     |     -      |

### Selection & Picker Components

| Component     | Continuum UI | S2 Styles | Animations |
| ------------- | :----------: | :-------: | :--------: |
| ComboBox      |      ✓       |     -     |     -      |
| Select/Picker |      ✓       |     -     |     -      |
| ListBox       |      ✓       |     -     |     -      |
| Menu          |      ✓       |     -     |     -      |
| TagGroup      |      ✓       |     -     |     -      |
| GridList      |      -       |     -     |     -      |

### Date & Time Components

| Component       | Continuum UI | S2 Styles | Animations |
| --------------- | :----------: | :-------: | :--------: |
| DatePicker      |      -       |     -     |     -      |
| DateRangePicker |      -       |     -     |     -      |
| DateField       |      -       |     -     |     -      |
| TimeField       |      -       |     -     |     -      |
| Calendar        |      -       |     -     |     -      |
| RangeCalendar   |      -       |     -     |     -      |

### Color Components

| Component         | Continuum UI | S2 Styles | Animations |
| ----------------- | :----------: | :-------: | :--------: |
| ColorPicker       |      -       |     -     |     -      |
| ColorArea         |      -       |     -     |     -      |
| ColorSlider       |      -       |     -     |     -      |
| ColorWheel        |      -       |     -     |     -      |
| ColorField        |      -       |     -     |     -      |
| ColorSwatch       |      -       |     -     |     -      |
| ColorSwatchPicker |      -       |     -     |     -      |

### Overlay Components

| Component          | Continuum UI | S2 Styles | Animations |
| ------------------ | :----------: | :-------: | :--------: |
| Dialog             |      ✓       |     -     |     -      |
| Dialog: Alert      |      -       |     -     |     -      |
| Dialog: Custom     |      -       |     -     |     -      |
| Dialog: Fullscreen |      -       |     -     |     -      |
| Modal              |      ✓       |     -     |     -      |
| Popover            |      ✓       |     -     |     -      |
| Tooltip            |      ✓       |     -     |     -      |

### Navigation Components

| Component   | Continuum UI | S2 Styles | Animations |
| ----------- | :----------: | :-------: | :--------: |
| Tabs        |      ✓       |     -     |     -      |
| Breadcrumbs |      ✓       |     -     |     -      |
| Link        |      ✓       |     -     |     -      |

### Status & Feedback Components

| Component   | Continuum UI | S2 Styles | Animations |
| ----------- | :----------: | :-------: | :--------: |
| ProgressBar |      ✓       |     -     |     -      |
| Meter       |      ✓       |     -     |     -      |
| Badge       |      ✓       |     -     |     -      |
| Toast       |      -       |     -     |     -      |

### Content Components

| Component       | Continuum UI | S2 Styles | Animations |
| --------------- | :----------: | :-------: | :--------: |
| Table           |      ✓       |     -     |     -      |
| Disclosure      |      ✓       |     -     |     -      |
| DisclosureGroup |      ✓       |     -     |     -      |
| Tree            |      -       |     -     |     -      |

### Typography Components

| Component | Continuum UI | S2 Styles | Animations |
| --------- | :----------: | :-------: | :--------: |
| Heading   |      ✓       |     -     |     -      |
| Title     |      ✓       |     -     |     -      |
| Body      |      ✓       |     -     |     -      |
| Detail    |      ✓       |     -     |     -      |
| Code      |      ✓       |     -     |     -      |

### File & Upload Components

| Component   | Continuum UI | S2 Styles | Animations |
| ----------- | :----------: | :-------: | :--------: |
| DropZone    |      -       |     -     |     -      |
| FileTrigger |      ✓       |     -     |     -      |

### Utility Components

| Component           | Continuum UI | S2 Styles | Animations |
| ------------------- | :----------: | :-------: | :--------: |
| Toolbar             |      -       |     -     |     -      |
| Separator (Divider) |      -       |     -     |     -      |
| VisuallyHidden      |      -       |     -     |     -      |

### Components in S2 but not in RAC

These should probably be our canidates to put into a seperate `@grahamcrackers/ui` package, as they build on the base components in this package.

| Component         | Continuum UI | S2 Styles | Animations |
| ----------------- | :----------: | :-------: | :--------: |
| ActionBar         |      -       |     -     |     -      |
| ActionButton      |      -       |     -     |     -      |
| ActionButtonGroup |      -       |     -     |     -      |
| ActionMenu        |      -       |     -     |     -      |
| Avatar            |      -       |     -     |     -      |
| AvatarGroup       |      -       |     -     |     -      |
| Card              |      -       |     -     |     -      |
| CardView          |      -       |     -     |     -      |
| ContextualHelp    |      -       |     -     |     -      |
| Divider           |      -       |     -     |     -      |
| Illustration      |      -       |     -     |     -      |
| InlineAlert       |      -       |     -     |     -      |
| ProgressCircle    |      ✓       |     -     |     -      |
| RangeSlider       |      -       |     -     |     -      |
| SegmentedControl  |      -       |     -     |     -      |
| SelectBox         |      -       |     -     |     -      |
| StatusLight       |      -       |     -     |     -      |
| ToggleButton      |      -       |     -     |     -      |
| ToggleButtonGroup |      -       |     -     |     -      |
| Well              |      -       |     -     |     -      |

### Legend

- ✓ : Component is available
- \- : Component is not currently available
