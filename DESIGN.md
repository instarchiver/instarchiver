---
name: Instarchiver
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
    padding: "8px 44px 8px 40px"
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

# Design System: Instarchiver

## Overview

**Creative North Star: "The Quiet Reading Room"**

The interface is a calm, gray room built so the archived photos and stories are the only real color on the page. Surfaces are near-white zinc in light mode and near-black zinc in dark mode, separated by one-pixel hairlines rather than shadows. A single indigo accent marks what you can act on. Everything else is ink and quiet gray.

It is deliberately familiar. A sticky top bar, media grids, search fields and dropdowns all behave the way visitors expect from social apps, so nobody has to learn the layout before finding the person they came for. Density is high: most text is 14px, gaps run 8 to 16px, and grids go up to five columns wide on desktop.

Precision carries the personality. Counts use tabular figures, dates are exact, and profile history renders as literal before and after values with an arrow between them. The UI keeps its own voice low so these facts read clearly.

**Key Characteristics:**
- Zinc neutrals with one indigo accent; media supplies the color.
- Flat bordered surfaces that lift slightly only on hover.
- Geist Sans throughout, mostly at 14px, semibold for headings.
- 44px minimum touch targets on every interactive control.
- Full light and dark themes defined from the same token names.

## Colors

A neutral zinc palette with one indigo accent, mirrored in a light and a dark theme from the same set of semantic tokens (`--background`, `--card`, `--accent` and so on in `app/globals.css`).

### Primary
- **Archive Indigo** (light `archive-indigo`, dark `archive-indigo-dark`): the one interactive color. It fills primary buttons, colors text links ("View all", "View profile history"), the verified seal, history timeline dots, the focus ring, text selection, and active tab underlines. Text on it is white in light mode and near-black in dark mode.

### Neutral
- **Page Mist** (`page-mist` / `page-mist-dark`): the page background, and the translucent fill behind the sticky header.
- **Card White** (`card-white` / `card-white-dark`): cards, inputs, dropdown panels, and the add-user dialog. It sits one small step off the page so cards read as objects without needing shadows.
- **Ink** (`ink` / `ink-dark`): primary text, usernames, headings, stat numbers.
- **Quiet Text** (`quiet-text` / `quiet-text-dark`): secondary text, descriptions, inactive nav, icons at rest, placeholder text, the "before" side of history diffs.
- **Hairline** (`hairline` / `hairline-dark`): every border and divider except form fields. The global stylesheet sets it as the default border color, inside the base layer so border utilities can override it.
- **Field Edge** (`field-edge` / `field-edge-dark`, token `--input`): the border of search, select and text fields. It is darker than Hairline so a field's edge reaches 3:1 against the page.
- **Well** (`well` / `well-dark`): hover and active fills for nav links and ghost buttons, skeleton shimmer, avatar placeholders, media-unavailable tiles, and the struck-through old bio in history.

### Semantic
- **Loss Red** (`loss-red` / `loss-red-dark`, token `--destructive`): errors, failed sign-in, negative count deltas, and the dot and title of a "Profile removed" entry in profile history.
- **Gain Green** (`gain-green` / `gain-green-dark`, token `--success`): positive count deltas in profile history, and nothing else.

### Media Overlay & Contrast
- **Story Card Scrim**: story tiles place a two-stop black gradient scrim (`from-black/75 via-black/35 to-transparent`) behind the top author bar and bottom timestamp, with 100% white text (`text-white`), holding at least 4.5:1 contrast even over bright media.
- **Media Badges & Controls**: post variant badges and the story viewer's audio toggle sit on a 60% black pill (`bg-black/60`) in 100% white; carousel previous and next arrows sit on 50% black circles (`bg-black/50`, darkening to 70% on hover).

### Named Rules
**The Media Owns Color Rule.** Chrome stays zinc and indigo. Photos, stories and avatars are the only full-color content, and the UI never competes with them through tinted panels or gradients.

**The One Accent Rule.** Archive Indigo is the only hue that signals interaction. Don't introduce a second accent; red and green are reserved for loss and gain.

## Typography

**Body Font:** Geist Sans (via `next/font`, with the system sans stack as fallback)
**Mono Font:** none. Nothing in the UI needs one, so Geist Mono is not loaded.

**Character:** One neutral grotesque at a few weights. Semibold carries the hierarchy and size changes stay small, which keeps pages compact and factual.

### Hierarchy
- **Display** (600, 1.875rem on mobile to 2.25rem from `sm`, tight tracking): the home page headline only.
- **Headline** (600, 1.5rem): section titles like "Recently archived stories", and the archive totals on home cards.
- **Title** (600, 1.25rem): the username on a profile page. Section card labels use 1.125rem at the same weight.
- **Body** (400, 0.875rem): the default for nearly all UI text: descriptions, nav, inputs, menu items, bios, history rows.
- **Body Lead** (400, 1rem, line height 1.75): introductory paragraphs under a page headline. Keep these to about 65ch (`max-w-2xl` centered).
- **Label** (500, 0.75rem): follower counts on cards, timestamps, and delta badges. History field names use it in uppercase with 0.025em tracking.

### Named Rules
**The Tabular Facts Rule.** Every count, delta, carousel slide counter (`1 / N`), and statistic uses tabular figures (`tabular-nums`) so columns of numbers line up and changes are easy to compare.

**The Even Lines Rule.** Headings use `text-wrap: balance` and paragraphs use `text-wrap: pretty`, set once in the base layer of `app/globals.css`. Headings are in sentence case.

## Layout

Content sits in one centered column capped at 72rem (`max-w-6xl`) with 16px side padding, widening to 24px from the `sm` breakpoint. The header uses the same container so the logo and page content share a left edge. Focused pages use narrower columns: 56rem (`max-w-4xl`) for post detail, 48rem (`max-w-3xl`) for profile history, and 28rem (`max-w-md`) for the home search bar, story detail column, branded 404 card, and add-user dialog.

On the home page, a centered profile lookup bar (`max-w-md` `SearchInput` paired with a 44px `"Find user"` submit button, stacked on mobile and inline from `sm`) sits directly below the lead copy. Below it, the three section cards switch to three compact columns from 360px (`min-[360px]:grid-cols-3`) so recent stories start above the fold.

Media grids are the main layout primitive. They use a 16px gap and step up by breakpoint: two columns on mobile, then three, four and five at `sm` (640px), `md` (768px) and `lg` (1024px) (`COLUMNS_2_3_4_5` on home recent media, `/posts`, `/stories`, and user detail posts). The users grid stops at four columns (`COLUMNS_2_3_4`), and user detail stories start at three columns on mobile (`COLUMNS_3_4_5`). Grids are virtualized and infinite-scrolling, so column counts are defined once in `components/ui/grid-columns.ts` and shared by the grid and its skeletons.

Loading skeletons match both aspect ratio and card structure: `UserCardSkeleton` mirrors the centered avatar and three text lines on `/users`, story grids show `9:16` footerless tiles, post grids show `1:1` footerless tiles, and detail skeletons preserve the hero `<ViewTransition>` target when a thumbnail is cached.

Vertical rhythm is 48 to 64px between page sections, 24px between a section heading and its grid, and 8 to 16px inside components. Root layout includes a `"Skip to content"` link (visually hidden via `sr-only` until focused, jumping to `#main-content`) and a branded 404 page (`app/not-found.tsx`) with primary recovery actions.

## Elevation & Depth

The system is flat at rest. Depth comes from tonal layering: Card White sits on Page Mist, separated by a Hairline border. Shadows appear only in two cases, a hover response or a floating layer.

### Shadow Vocabulary
- **Lift** (`shadow-md`, paired with a 2px upward translate over 200ms `ease-out-expo`): hover state on every clickable card and media tile. Pressing settles the card back flat with no shadow. Under reduced motion the shadow still appears but the card doesn't move.
- **Float** (`shadow-md`): dropdown menus, the account menu, and the add-user dialog, which also animates its backdrop to 50% black (`open:backdrop:bg-black/50`). Floating layers enter from 95% scale and 0 opacity (menus 150ms, the dialog 200ms) and grow from their trigger's corner. The dialog leaves in 150ms. Reduced motion keeps the fade and drops the scale.

The sticky header uses a 95% opaque Page Mist fill with backdrop blur, dropping to an 80% translucent background when `backdrop-filter` is supported (`supports-backdrop-filter:bg-background/80`), instead of a shadow.

### Named Rules
**The Flat-By-Default Rule.** Nothing casts a shadow at rest. If a surface needs separation, use a Hairline border or a step between Page Mist and Card White.

## Shapes

Corners are gently rounded at a small set of radii. 12px (`rounded-xl`) is for containers: cards, media tiles, history entries, empty and error states, and the 404 panel. 8px (`rounded-lg`) is for controls: buttons, inputs, nav links, dropdown panels, the logo tile, and carousel dot hit areas. 6px (`rounded-md`) is for small items inside those: menu rows, the search clear button's inner hover pill, and delta badges. Avatars, carousel arrow buttons, and media-type badges are full circles.

Borders are always one pixel of Hairline. Empty, error, inline retry, and 404 panels use a dashed border to read as a gap in the archive, not a missing component. Media is clipped to its container's radius at a fixed aspect ratio: `1:1` for post tiles, `9:16` for story tiles and the story viewer, and `1:1` widening to `4:5` from `sm` on post detail.

## Components

### Buttons, Touch Targets & Focus
Restrained and conventional, sized for touch.
- **Shape:** gently rounded (8px), at least 44px tall (`min-h-11`). That 44px minimum applies equally to compact controls: the `SearchInput` clear button (`44px` hit box around a `28px` hover pill), `SelectMenu` option rows, the `AddUserDialog` close button, `PostCarousel` pagination dot buttons, and the `StoryViewer` audio toggle.
- **Primary:** Archive Indigo fill with contrast text, 14px medium, 16px side padding, often with a 16px leading icon ("Add user", "Log in with Google", "Try again").
- **Secondary:** Card White fill with a 1px Hairline border and Ink text; fills with Well on hover. Used for recovery actions like "Clear search" and "Browse users".
- **Hover / Focus:** primary hover drops opacity to 90%. Every interactive control—links, cards, buttons, tabs, and media overlay controls—draws a consistent 2px Archive Indigo keyboard focus outline offset by 2px (`focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring`).
- **Ghost:** no fill, Quiet Text; hover fills with Well and darkens to Ink. Used for Cancel and Login.
- **Icon button:** a 44px square ghost button holding a 20px icon (theme toggle, account avatar, dialog close).

### Cards / Containers
- **Corner Style:** 12px.
- **Background:** Card White with a Hairline border.
- **Shadow Strategy:** flat at rest, with Lift on hover for linked cards (see Elevation & Depth).
- **Internal Padding:** 16px for user cards and history entries, 12px (`p-3`) on phones up to 24px (`sm:p-6`) for the home section cards.

### Inputs / Fields
- **Style:** Card White fill, Field Edge border, 8px radius, 44px tall, 14px text. Search has an 18px magnifier inset 12px from the left and a 44px clear button on the right once there is text.
- **Focus:** a 2px Archive Indigo ring around the whole field (`focus-within`), with the native outline removed.
- **Error:** Loss Red message below the field, linked with `aria-describedby` and marked with `aria-invalid`.

### Select Menu
A custom WAI-ARIA `listbox` styled to match inputs: same fill, border, radius and 44px height, an optional leading icon, and a caret that rotates when open (with `motion-reduce:transition-none`). The floating `<ul>` (`role="listbox"`, `aria-activedescendant`) holds `role="option"` `<li>` rows (`min-h-11`), where the highlighted row fills with Well and the selected row is medium weight. It supports `ArrowUp`/`ArrowDown`, `Home`, `End`, `Enter`/`Space`, `Escape`, and closes on `Tab` or outside blur, restoring focus to the trigger button when a choice is committed or dismissed with Escape.

### Navigation
A sticky 64px header with a translucent Page Mist background (`bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/80`). Links are 14px medium (`min-h-11`) with an 18px icon; inactive links are Quiet Text and fill with Well on hover, while the active link gets a Well fill, Ink text, and a filled icon. Below `sm`, the logo stays a `44px × 44px` (`min-h-11 min-w-11`) target, the Home link hides since the logo links home, and mobile nav labels plus the header wordmark use `sr-only sm:not-sr-only` so icons stand alone visually while keeping their full accessible names.

### Media Tile, Post Carousel & Story Viewer
The signature pattern. Post and story tiles are image-only cards that crop media to a fixed ratio inside a 12px clipped frame. Posts mark carousel and video variants with a white icon on a 60% black circle in the top right corner. Stories overlay the owner's avatar and username at the top and a relative timestamp at the bottom on a 75% black gradient scrim (`from-black/75 via-black/35 to-transparent`) in 100% white (`text-white`).

Tapping a tile morphs its image into the detail page's hero (420ms, `cubic-bezier(0.16, 1, 0.3, 1)`, a 2px blur at mid-flight). Each tile and its hero share a React `<ViewTransition>` named `post-<id>` or `story-<id>`. The detail page's loading skeleton shows the tapped thumbnail from the React Query cache, so the morph has a target while the page loads. Reduced motion turns it off. This is the system's one signature motion; don't add other page-level transitions next to it.

- **Post Carousel:** renders slides at `1:1` on mobile and `4:5` from `sm` with `fit="contain"` over a blurred backdrop, preloading adjacent images. Multi-item posts support keyboard `ArrowLeft`/`ArrowRight` (ignored inside `<video>`), horizontal touch swipes (`40px` threshold), and 44px circular prev/next buttons (`bg-black/50`, `hover:bg-black/70`). Below the media frame—never overlapping `<video controls>`—sit 44px pagination dot buttons alongside a `tabular-nums` `1 / N` counter (`aria-live="polite"`).
- **Story Viewer:** constrains its `9:16` frame to `calc(100dvh - 15rem)` (`w-[min(100%,calc((100dvh-15rem)*9/16))] max-w-sm`) so vertical media fits in a single viewport. Video stories honor a `prefers-reduced-motion` guard that skips autoplay, and expose a 44px top-right `Muted` / `Sound on` pill (`bg-black/60`, `aria-pressed`) synced to the video's volume state.
- **Media Unavailable Fallback:** when a media URL is missing or triggers `onError`, `MediaItem` and `MediaImage` render a `Well`-filled `MediaUnavailable` container (`role="img"`) with a centered `ImageBroken` icon.

### Empty, Error & 404 States
- **EmptyState:** centered dashed Hairline panel (`rounded-xl`) with a 32px icon, title, optional description, and recovery action slot (such as secondary `"Clear search"` and primary `"Add user"` / `"Add @handle"` buttons on filtered grids).
- **ErrorState:** dashed `role="alert"` panel with a 32px Loss Red warning icon, message, and `"Try again"` primary button.
- **InfiniteGrid Inline Pagination Retry:** when a subsequent page fails after items have already loaded, `InfiniteGrid` keeps the loaded grid intact and appends a dashed `role="alert"` banner with an inline `"Try again"` button.
- **404 Recovery:** unknown routes hit the branded `app/not-found.tsx` card (`"Return home"` and `"Browse users"`), while client-fetched detail pages (`UserDetail`, `UserHistory`, `PostDetail`, `StoryDetail`) catch API `404` responses with a contextual `EmptyState` and a primary link back to the corresponding index.

### Profile Tabs & History Timeline
On User Detail, `UserProfileHeader` pairs the avatar, badges, tabular stats, and bio with both `In the archive since` and `Last synced` dates, plus a link to profile history. Below it, a WAI-ARIA `tablist` / `tabpanel` switches between `Posts` (`COLUMNS_2_3_4_5`, `1:1`) and `Stories` (`COLUMNS_3_4_5`, `9:16`), supporting `ArrowLeft`/`ArrowRight`/`Home`/`End` keyboard switching with a 2px Archive Indigo bottom border on the selected tab. Private accounts with no captured items explain why (`"This account is private, so only posts/stories archived while it was public can appear here."`).

Profile history is a vertical timeline. A 1px Hairline rail connects 15px Archive Indigo dots (Loss Red for `"Profile removed"`), and each entry is a card. Inside, each change is a row: a field label, the old value in Quiet Text (struck through for text), an arrow, and the new value in medium Ink. Count changes end with a delta badge in Gain Green or Loss Red. Bio changes stack the old bio in a Well block above the new one in a bordered block. While paginated history snapshots are still scanning with no visible diffs yet, the footer spinner pairs with `"Checking older snapshots…"`.

## Do's and Don'ts

### Do:
- **Do** use the semantic tokens (`bg-card`, `text-muted-foreground`, `border-border`, `bg-accent`) and never raw zinc or indigo classes, so both themes stay correct.
- **Do** keep every interactive control at least 44px tall (`min-h-11`).
- **Do** check every text and badge pair at 4.5:1 and every field edge at 3:1, in both themes, including text on the Well fill.
- **Do** put any text over story media on the 75% black gradient scrim (`from-black/75 via-black/35 to-transparent`), in 100% white (`text-white`).
- **Do** use `sr-only sm:not-sr-only` (never `display: none`) for mobile icon-only nav labels and the header wordmark so screen readers retain their accessible names.
- **Do** use `tabular-nums` for every count, delta, slide counter, and statistic.
- **Do** use the shared grid column presets in `components/ui/grid-columns.ts` for any new media grid, so skeletons and virtualization match.
- **Do** name transition properties (`transition-[translate,box-shadow]`, `transition-colors`) instead of `transition-all`, use the `ease-out-expo` curve for movement, and give every animation—including `Skeleton` and `Spinner` (`motion-reduce:animate-none`)—a `motion-reduce:` fallback.

### Don't:
- **Don't** add shadows to surfaces at rest; shadows mean hover or floating.
- **Don't** introduce a second accent hue or use Archive Indigo decoratively; it signals interaction or verification only.
- **Don't** use Gain Green or Loss Red outside gains, losses and errors.
- **Don't** add new corner radii beyond 6px, 8px, 12px and full.
- **Don't** tint or color-grade archived media. The black text scrim is the only overlay it gets.
- **Don't** place carousel pagination dots or counters over `<video controls>`; keep them below the media frame.
