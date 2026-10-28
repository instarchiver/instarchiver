---
name: InstArchiver
description: A public archive of Instagram profiles, stories, posts, and profile history.
colors:
  archive-indigo: "#4f46e5"
  archive-indigo-dark: "#818cf8"
  page-mist: "#fafafa"
  page-mist-dark: "#0b0b0d"
  card-white: "#ffffff"
  card-white-dark: "#18181b"
  ink: "#18181b"
  ink-dark: "#f4f4f5"
  hairline: "#e4e4e7"
  hairline-dark: "#2a2a2e"
  well: "#f4f4f5"
  well-dark: "#202023"
  quiet-text: "#6b6b74"
  quiet-text-dark: "#a1a1aa"
  loss-red: "#b91c1c"
  loss-red-dark: "#f87171"
  gain-green: "#047857"
  gain-green-dark: "#34d399"
  field-edge: "#8a8a93"
  field-edge-dark: "#6a6a73"
typography:
  display:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "2.25rem"
    fontWeight: 600
    lineHeight: 1.11
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.33
  title:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.4
  body:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.43
  body-lead:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 500
    lineHeight: 1.33
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "64px"
components:
  button-primary:
    backgroundColor: "{colors.archive-indigo}"
    textColor: "{colors.card-white}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.quiet-text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-ghost-hover:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  icon-button:
    backgroundColor: "transparent"
    textColor: "{colors.quiet-text}"
    rounded: "{rounded.md}"
    size: "44px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.quiet-text}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 12px"
    height: "44px"
  nav-link-active:
    backgroundColor: "{colors.well}"
    textColor: "{colors.ink}"
  input-search:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "8px 40px"
    height: "44px"
  card:
    backgroundColor: "{colors.card-white}"
    textColor: "{colors.ink}"
    rounded: "{rounded.lg}"
    padding: "16px"
  media-tile:
    backgroundColor: "{colors.card-white}"
    rounded: "{rounded.lg}"
  delta-gain:
    backgroundColor: "rgba(4, 120, 87, 0.1)"
    textColor: "{colors.gain-green}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
  delta-loss:
    backgroundColor: "rgba(185, 28, 28, 0.1)"
    textColor: "{colors.loss-red}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "2px 6px"
---

# Design System: InstArchiver

## Overview

**Creative North Star: "The Quiet Reading Room"**

The interface is a calm, gray room built so the archived photos and stories are the only real color on the page. Surfaces are near-white zinc in light mode and near-black zinc in dark mode, separated by one-pixel hairlines rather than shadows. A single indigo accent marks what you can act on. Everything else is ink and quiet gray.

It is deliberately familiar. A sticky top bar, media grids, search fields and dropdowns all behave the way visitors expect from social apps, so nobody has to learn the layout before finding the person they came for. Density is high: most text is 14px, gaps run 8 to 16px, and grids go up to five columns wide on desktop.

Precision carries the personality. Counts use tabular figures, dates are exact, and profile history renders as literal before and after values with an arrow between them. The UI keeps its own voice low so these facts read clearly.

**Key Characteristics:**
- Zinc neutrals with one indigo accent; media supplies the color.
- Flat bordered surfaces that lift slightly only on hover.
- Geist Sans throughout, mostly at 14px, semibold for headings.
- 44px minimum touch targets on every control.
- Full light and dark themes defined from the same token names.

## Colors

A neutral zinc palette with one indigo accent, mirrored in a light and a dark theme from the same set of semantic tokens (`--background`, `--card`, `--accent` and so on in `app/globals.css`).

### Primary
- **Archive Indigo** (light `archive-indigo`, dark `archive-indigo-dark`): the one interactive color. It fills primary buttons, colors text links ("View all", "View profile history"), the verified seal, history timeline dots, the focus ring, text selection, and the "IA" logo tile. Text on it is white in light mode and near-black in dark mode.

### Neutral
- **Page Mist** (`page-mist` / `page-mist-dark`): the page background, and the translucent fill behind the sticky header.
- **Card White** (`card-white` / `card-white-dark`): cards, inputs, dropdown panels, the dialog. It sits one small step off the page so cards read as objects without needing shadows.
- **Ink** (`ink` / `ink-dark`): primary text, usernames, headings, stat numbers.
- **Quiet Text** (`quiet-text` / `quiet-text-dark`): secondary text, descriptions, inactive nav, icons at rest, placeholder text, the "before" side of history diffs.
- **Hairline** (`hairline` / `hairline-dark`): every border and divider except form fields. The global stylesheet sets it as the default border color, inside the base layer so border utilities can override it.
- **Field Edge** (`field-edge` / `field-edge-dark`, token `--input`): the border of search, select and text fields. It is darker than Hairline so a field's edge reaches 3:1 against the page.
- **Well** (`well` / `well-dark`): hover and active fills for nav links and ghost buttons, skeleton shimmer, avatar placeholders, the struck-through old bio in history.

### Semantic
- **Loss Red** (`loss-red` / `loss-red-dark`, token `--destructive`): errors, failed sign-in, negative count deltas, and the dot and title of a "Profile removed" entry in profile history.
- **Gain Green** (`gain-green` / `gain-green-dark`, token `--success`): positive count deltas in profile history, and nothing else.

### Named Rules
**The Media Owns Color Rule.** Chrome stays zinc and indigo. Photos, stories and avatars are the only full-color content, and the UI never competes with them through tinted panels or gradients.

**The One Accent Rule.** Archive Indigo is the only hue that signals interaction. Don't introduce a second accent; red and green are reserved for loss and gain.

## Typography

**Body Font:** Geist Sans (via `next/font`, with the system sans stack as fallback)
**Mono Font:** none. Nothing in the UI needs one, so Geist Mono is not loaded.

**Character:** One neutral grotesque at a few weights. Semibold carries the hierarchy and size changes stay small, which keeps pages compact and factual.

### Hierarchy
- **Display** (600, 1.875rem on mobile to 2.25rem from `sm`, tight tracking): the home page headline only.
- **Headline** (600, 1.5rem): section titles like "Recently Archived Stories", and the archive totals on home cards.
- **Title** (600, 1.25rem): the username on a profile page. Section card labels use 1.125rem at the same weight.
- **Body** (400, 0.875rem): the default for nearly all UI text: descriptions, nav, inputs, menu items, bios, history rows.
- **Body Lead** (400, 1rem, line height 1.75): introductory paragraphs under a page headline. Keep these to about 65ch (`max-w-2xl` centered).
- **Label** (500, 0.75rem): follower counts on cards, timestamps, and delta badges. History field names use it in uppercase with 0.025em tracking.

### Named Rules
**The Tabular Facts Rule.** Every count, delta and statistic uses tabular figures (`tabular-nums`) so columns of numbers line up and changes are easy to compare.

**The Even Lines Rule.** Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`, set once in the base layer of `app/globals.css`. Headings are in sentence case.

## Layout

Content sits in one centered column capped at 72rem (`max-w-6xl`) with 16px side padding, widening to 24px from the `sm` breakpoint. The header uses the same container so the logo and page content share a left edge. Focused pages use narrower columns: 56rem (`max-w-4xl`) for post detail, 48rem (`max-w-3xl`) for profile history, and 28rem for the add-user dialog.

Media grids are the main layout primitive. They use a 16px gap and step up by breakpoint: two columns on mobile, then three, four and five at `sm` (640px), `md` (768px) and `lg` (1024px). The users grid stops at four columns. Grids are virtualized and infinite-scrolling, so column counts are defined once in `components/ui/grid-columns.ts` and shared by the grid and its skeletons.

Vertical rhythm is 48 to 64px between page sections, 24px between a section heading and its grid, and 8 to 16px inside components. On mobile, nav links collapse to icons only and the wordmark hides, leaving the "IA" tile.

## Elevation & Depth

The system is flat at rest. Depth comes from tonal layering: Card White sits on Page Mist, separated by a Hairline border. Shadows appear only in two cases, a hover response or a floating layer.

### Shadow Vocabulary
- **Lift** (`shadow-md`, paired with a 2px upward translate over 200ms `ease-out-expo`): hover state on every clickable card and media tile. Pressing settles the card back flat with no shadow. Under reduced motion the shadow still appears but the card doesn't move.
- **Float** (`shadow-md`): dropdown menus, the account menu, and the add-user dialog, which also gets a 50% black backdrop. Floating layers enter from 95% scale and 0 opacity (menus 150ms, the dialog 200ms) and grow from their trigger's corner. The dialog leaves in 150ms. Reduced motion keeps the fade and drops the scale.

The sticky header uses an 80% translucent background with backdrop blur instead of a shadow.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow at rest. If a surface needs separation, use a Hairline border or a step between Page Mist and Card White.

## Shapes

Corners are gently rounded at a small set of radii. 12px (`rounded-xl`) is for containers: cards, media tiles, history entries, empty and error states. 8px (`rounded-lg`) is for controls: buttons, inputs, nav links, dropdown panels, the logo tile. 6px (`rounded-md`) is for small items inside those: menu rows, the search clear button, delta badges. Avatars and media-type badges are full circles.

Borders are always one pixel of Hairline. Empty and error states use a dashed border to read as a gap in the archive, not a missing component. Media is always clipped to its tile's radius at a fixed aspect ratio: square for posts, 9:16 for stories.

## Components

### Buttons
Restrained and conventional, sized for touch.
- **Shape:** gently rounded (8px), at least 44px tall.
- **Primary:** Archive Indigo fill with contrast text, 14px medium, 16px side padding, often with a 16px leading icon ("Add user", "Log in with Google", "Try again").
- **Hover / Focus:** hover drops opacity to 90%. Keyboard focus draws a 2px Archive Indigo outline offset by 2px.
- **Ghost:** no fill, Quiet Text; hover fills with Well and darkens to Ink. Used for Cancel and Login.
- **Icon button:** a 44px square ghost button holding a 20px icon (theme toggle, account avatar).

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Card White with a Hairline border.
- **Shadow Strategy:** flat at rest, with Lift on hover for linked cards (see Elevation & Depth).
- **Internal Padding:** 16px for user cards and history entries, 24px for the home section cards.

### Inputs / Fields
- **Style:** Card White fill, Field Edge border, 8px radius, 44px tall, 14px text. Search has an 18px magnifier inset 12px from the left and a clear button on the right once there is text.
- **Focus:** a 2px Archive Indigo ring around the whole field (`focus-within`), with the native outline removed.
- **Error:** Loss Red message below the field, linked with `aria-describedby`.

### Select Menu
A custom listbox styled to match inputs: same fill, border, radius and height, an optional leading icon, and a caret that rotates when open. The panel floats with the Float shadow; the highlighted row fills with Well and the selected row is medium weight. It supports arrow keys, Home, End and Escape.

### Navigation
A sticky 64px header with a translucent Page Mist background. Links are 14px medium with an 18px icon. Inactive links are Quiet Text and fill with Well on hover. The active link has a Well fill, Ink text, and a filled icon. Below `sm`, the text labels hide and only icons remain.

### Media Tile
The signature component. Post and story tiles are image-only cards that crop media to a fixed ratio inside a 12px clipped frame. Posts mark carousel and video variants with a small white icon on a 60% black circle in the top right corner. Stories overlay the owner's avatar and username at the top and a relative timestamp at the bottom, each on a black-to-transparent gradient scrim so white text stays legible over any image.

Tapping a tile morphs its image into the detail page's hero (420ms, `cubic-bezier(0.16, 1, 0.3, 1)`, a 2px blur at mid-flight). Each tile and its hero share a React `<ViewTransition>` named `post-<id>` or `story-<id>`. The detail page's loading skeleton shows the tapped thumbnail from the React Query cache, so the morph has a target while the page loads. Reduced motion turns it off. This is the system's one signature motion; don't add other page-level transitions next to it.

### History Timeline
Profile history is a vertical timeline. A 1px Hairline rail connects 15px Archive Indigo dots, and each entry is a card. Inside, each change is a row: a field label, the old value in Quiet Text (struck through for text), an arrow, and the new value in medium Ink. Count changes end with a delta badge in Gain Green or Loss Red. Bio changes stack the old bio in a Well block above the new one in a bordered block.

## Do's and Don'ts

### Do:
- **Do** use the semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`, `bg-accent`) and never raw zinc or indigo classes, so both themes stay correct.
- **Do** keep every interactive control at least 44px tall (`min-h-11`).
- **Do** check every text and badge pair at 4.5:1 and every field edge at 3:1, in both themes, including text on the Well fill.
- **Do** put any text over media on the 60% black gradient scrim, in white.
- **Do** use `tabular-nums` for every count, delta and statistic.
- **Do** name transition properties (`transition-[translate,box-shadow]`, `transition-colors`) instead of `transition-all`, use the `ease-out-expo` curve for movement, and give every movement a `motion-reduce:` fallback.
- **Do** use the shared grid column presets in `components/ui/grid-columns.ts` for any new media grid, so skeletons and virtualization match.

### Don't:
- **Don't** add shadows to surfaces at rest; shadows mean hover or floating.
- **Don't** introduce a second accent hue or use Archive Indigo decoratively; it signals interaction or verification only.
- **Don't** use Gain Green or Loss Red outside gains, losses and errors.
- **Don't** add new corner radii beyond 6px, 8px, 12px and full.
- **Don't** tint or color-grade archived media. The black text scrim is the only overlay it gets.
