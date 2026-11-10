# UI Components (shadcn/ui)

## Rule

ALL UI elements in this app MUST use shadcn/ui components. DO NOT create custom components.

## Guidelines

- Before building any UI, check whether a shadcn/ui component exists for it (buttons, inputs, forms, dialogs, cards, tables, dropdowns, toasts, etc.).
- If the component is not yet in `components/ui/`, add it with the CLI: `npx shadcn@latest add <component>`.
- Import from `@/components/ui/<component>`.
- Do NOT hand-write custom UI primitives or wrapper components, and do NOT use raw HTML elements (e.g. `<button>`, `<input>`) where a shadcn/ui equivalent exists.
- Do NOT edit generated files in `components/ui/` to add custom behavior.
- Compose pages directly from shadcn/ui components, using Tailwind utility classes for layout and spacing only.
- Use `cn()` from `@/lib/utils` for conditional class names.

## Installation

Add components with the CLI (config is read from `components.json`):

```bash
npx shadcn@latest add button
npx shadcn@latest add card input label dialog   # multiple at once
```

Files are written to `components/ui/`. Currently installed: `button`.

Always check `components/ui/` first; install only what is missing.

## Available Components

| Category | Components |
| --- | --- |
| Actions | `button`, `button-group`, `toggle`, `toggle-group` |
| Forms | `input`, `input-group`, `textarea`, `label`, `field`, `form`, `checkbox`, `radio-group`, `select`, `switch`, `slider`, `calendar`, `combobox`, `input-otp` |
| Layout | `card`, `separator`, `tabs`, `accordion`, `collapsible`, `resizable`, `scroll-area`, `aspect-ratio`, `sidebar` |
| Overlays | `dialog`, `alert-dialog`, `sheet`, `drawer`, `popover`, `tooltip`, `hover-card`, `dropdown-menu`, `context-menu`, `command` |
| Navigation | `navigation-menu`, `menubar`, `breadcrumb`, `pagination` |
| Feedback | `alert`, `sonner` (toasts), `progress`, `skeleton`, `spinner`, `badge` |
| Data | `table`, `avatar`, `chart`, `carousel` |

Full list: https://ui.shadcn.com/docs/components

## Usage

Import from `@/components/ui/<component>` and compose directly in pages.

```tsx
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default function Page() {
  return (
    <Card className="mx-auto max-w-md">
      <CardHeader>
        <CardTitle>Shorten a link</CardTitle>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Input placeholder="https://example.com" />
        <Button>Shorten</Button>
      </CardContent>
    </Card>
  )
}
```

This project uses the `base-lyra` style (Base UI). To render a component as another element (e.g. a link), use the `render` prop, not `asChild`. For a Button rendered as a link, set `nativeButton={false}` and retain link semantics with `role="link"`:

```tsx
import Link from "next/link"
import { Button } from "@/components/ui/button"

<Button nativeButton={false} role="link" render={<Link href="/dashboard" />}>Dashboard</Button>
```

Icons come from Phosphor (`@phosphor-icons/react`).

## Customization

Customize through the component's built-in options, in this order:

1. **Variants and sizes** (defined with `cva` in each component):

   ```tsx
   <Button variant="outline" size="sm">Cancel</Button>
   <Button variant="destructive">Delete</Button>
   ```

2. **`className`** for layout and spacing, merged via `cn()`:

   ```tsx
   <Button className="w-full">Create link</Button>
   ```

3. **Theme tokens** in `app/globals.css` (CSS variables such as `--primary`, `--radius`) for app-wide color and radius changes.

Do NOT fork a component into a new file to change its look. If a variant is genuinely needed everywhere, add it to the `cva` definition in the shadcn file as a deliberate, app-wide change.

## DO vs DON'T

| DO | DON'T |
| --- | --- |
| Use `<Button>` from `@/components/ui/button` | Use raw `<button>` or build a `MyButton` component |
| Install missing components with `npx shadcn@latest add` | Hand-write a component that mimics a shadcn one |
| Use `variant` and `size` props | Override colors with long `className` strings |
| Use `className` for layout (`w-full`, `mt-4`, `flex`) | Restyle component internals with `className` |
| Change global look via CSS variables in `globals.css` | Hardcode colors like `bg-[#3b82f6]` |
| Compose shadcn parts (`Card` + `CardHeader` + `Button`) in the page | Create wrapper components such as `LinkCard.tsx` for UI |
| Use the `render` prop for links (`<Button render={<Link />} />`) | Use `asChild` or wrap `<Button>` in `<a>` |
| Use `cn()` for conditional classes | Concatenate class strings manually |
| Use Phosphor icons | Mix in other icon libraries or inline SVGs |

## Configuration

Settings live in `components.json` (style `base-lyra`, icon library `phosphor`, aliases under `@/`). Follow them when adding components.
