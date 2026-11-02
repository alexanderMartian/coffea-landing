# Figma (Bridge `get_node` JSON) → code

`get_node` returns for every node: `id, name, type, bounds {x, y, width, height}` (relative to the parent), `styles {...}`, `children`, and for TEXT `characters` + text styles. Fields below are exactly the Bridge names.

## Auto layout → flex / grid
| Figma (`styles.autoLayout`) | Code |
|---|---|
| `direction: HORIZONTAL` | `flex flex-row` (on mobile often `flex-col` — see the patterns) |
| `direction: VERTICAL` | `flex flex-col` |
| `gap` | `gap-*` — Tailwind v4 accepts any multiple of 4 px: `gap-18` = 72 px |
| `primaryAxisAlign` MIN / CENTER / MAX / SPACE_BETWEEN | `justify-start` / `justify-center` / `justify-end` / `justify-between` |
| `counterAxisAlign` MIN / CENTER / MAX / BASELINE | `items-start` / `items-center` / `items-end` / `items-baseline` |
| `primaryAxisSizing` / `counterAxisSizing` AUTO (hug) | no size on that axis |
| `... FIXED` | size from `bounds` → becomes `max-w-*` / basis / token, never a hard `w-[...]` on text containers |
| `wrap: WRAP` + `counterAxisSpacing` | `flex-wrap gap-x-* gap-y-*`; equal-width children → prefer `grid grid-cols-*` |
| `styles.padding {top,right,bottom,left}` | `pt-* pr-* pb-* pl-*` (`px-*`/`py-*` when equal); section paddings → fluid token (breakpoints.md) |

**Child sizing is not exported — infer it:**
- child width ≈ parent width − paddingLeft − paddingRight → **fill**: `w-full` (column) or `flex-1` (row, when siblings share space);
- child width = its content → **hug**: no width;
- otherwise **fixed**: `basis-*` / `max-w-*` / a token.

**No auto layout** (absolute positions): rebuild with flex/grid from the positions. `absolute` only for real overlaps — decor, badges, floating labels — anchored to the content container. Take their offsets from the node `bounds` (e.g. `top-6 right-7` from the icon's distance to the photo's top and right edges), never by eye, and put them in the spec.

## Sizes: what may be fixed
| Element | Fixed size | How instead |
|---|---|---|
| Text | ❌ no `h-*`, no `w-*` | width → `max-w-*`; height from lines |
| Cards | ❌ height; width only responsive | `w-[85%] lg:w-[30%] 3xl:w-[417px]`; equal heights via grid/flex + `h-full` + `mt-auto` |
| Sections | ❌ `h-*` | `min-h-*` (`md:min-h-[335px]`) |
| Buttons with text | ❌ `h-*` | padding + `min-h-*` |
| Icons, round icon buttons, avatars, dots | ✅ | `size-*`, `h-* w-*` |
| Media | ratio, not height | `aspect-[w/h]` + `next/image fill` |

A height that differs from Figma is a symptom: compare font size, line height, letter spacing, text width (wrapping), padding, gaps and Vertical trim. Never hide the difference with `h-*`, `max-h-*` + `overflow-hidden`, `line-clamp` or a magic gap.

## Text
| Figma | Code |
|---|---|
| `fontFamily`, `fontWeight` | font token; weight `font-*` (100 thin … 900 black) |
| `fontSize` | type token (fluid for ≥ 32 px, breakpoints.md) |
| `lineHeight {unit: PIXELS, value}` | ratio = value / fontSize → in the token (`--text-*--line-height`) or `leading-[1.1]` |
| `lineHeight {unit: PERCENT, value}` | ratio = value / 100 |
| `lineHeight {unit: AUTO}` | ≈ 1.2; leave default unless the reference shows otherwise |
| `letterSpacing {unit: PERCENT, value}` | `tracking-[value/100 em]` e.g. −2 % → `tracking-[-0.02em]` |
| `letterSpacing {unit: PIXELS, value}` | em = value / fontSize |
| `textAlignHorizontal` | `text-left / text-center / text-right` (avoid justify) |
| `textAutoResize: WIDTH_AND_HEIGHT` | hug — no width |
| `textAutoResize: HEIGHT` or `NONE` | fixed width in Figma → `max-w-[..px]` or `max-w-[NNch]`, height grows |
| `textAutoResize: TRUNCATE` | `line-clamp-*` |
| `textDecoration: UNDERLINE` | `underline` |
| `"mixed"` values | several styles in one text → check the reference image, use `<span>`s |

Not exported: **text case** (UPPERCASE via style) — always compare headings, nav, buttons and the logo with `design/<id>.png`; keep the copy as written in `characters` and add `uppercase` (or `lowercase`) if the reference shows it.
Headings by meaning, not size: one `h1` (hero), `h2` per section title, `h3` for cards.

### Vertical trim (Figma "leading trim") — not exported, detect it
Figma can trim a text box from the cap height of the first line to the baseline of the last one (Typography → Type settings → Basics → Vertical trim → "Cap height to baseline"). The box is then shorter than `lines × lineHeight`, while all glyphs fit inside. It is **not** a design error.
- Signature: `h ≈ (lines − 1) × lineHeight + cap height` (cap height ≈ 0.62–0.78 × fontSize). Example: Poppins 12/20, 5 lines → 100 untrimmed, 88 in Figma. `section-check` prints a hint when it sees it.
- Ask the user to confirm the setting on that text in Figma (one click), then: `[text-box:trim-both_cap_alphabetic]` on the text element (CSS `text-box: trim-both cap alphabetic`; Chrome/Edge 133+, Safari 18.2+, Firefox 154+; older browsers simply show a little more air). Padding and gaps stay the Figma values.
- **Trim + fixed-height box** (Figma shows `Fill × 47`, not `Hug`): the box is taller than the trimmed text (2 × 28 trimmed ≈ 43 in a 47 box → 4 px empty under the text, top-aligned). Trim the text and add the extra px to the following gap (`gap-3` → `gap-4`) with a code comment explaining it.
- Only the texts that have trim get it — Figma often mixes trimmed and untrimmed texts in one card.
- **Real design error** = glyphs actually overflow the box in Figma. Rule out trim first, then ask: exact visual match (compensation with a code comment) or honest spacing.

### Copy
- Render design text **verbatim**, Lorem ipsum included. Fake copy is marked with a code comment above the field in `content/site.ts` — `// PLACEHOLDER: lorem from the design` — never inside the rendered string. Real design texts (names, prices, buttons, headings) are not placeholders. Never invent copy ("Customer Name", "Role").
- HTML collapses repeated spaces from `characters` — fine, it only shortens lines.
- Obvious typos in the design ("Explore Out Products", "INFOTNATION", "Plons & pricing"): fix them and list each one as «було → стало» in the report, so the user can confirm with the client (brand names and wordplay stay as they are).

## Paint, effects, shape
| Figma | Code |
|---|---|
| `fills: SOLID {color, opacity}` | color token; opacity < 1 → `bg-primary/80` |
| `fills: GRADIENT_LINEAR {gradientStops}` | `bg-linear-<angle>` / token `--gradient-*` if reused; read the angle from the reference |
| `fills: IMAGE {scaleMode}` | `next/image`; FILL/CROP → `object-cover` (+ `object-[x_y]` for crop), FIT → `object-contain` |
| `effects: DROP_SHADOW {offset, radius, spread, color, opacity}` | `box-shadow: x y radius spread rgba()` → token `--shadow-*` |
| `effects: INNER_SHADOW` | same with `inset` |
| `effects: LAYER_BLUR {radius}` / `BACKGROUND_BLUR` | `blur-[r/2 px]` / `backdrop-blur-[r/2 px]` (CSS blur ≈ half of Figma radius) |
| `strokes` + `strokeWeight`, `strokeAlign: INSIDE` | `border border-*` |
| `strokeAlign: OUTSIDE` | `ring-*` or `outline` |
| `cornerRadius` / `cornerRadii` | radius token / `rounded-tl-* …` |
| `opacity` (node) | `opacity-*` |
| `blendMode: MULTIPLY` (image on a light background) | `mix-blend-multiply` — white becomes the background color. Typical: a JPG with a white background laid over a colored section (Coffea Promo, Newsletter). Without it the page shows white boxes around the picture. If `blendMode` isn't in the response: an exported image has a white background but the reference shows none → it is multiply |
| `clipsContent: true` | `overflow-hidden` on media/decor containers; on sections `overflow-x-clip` (never `overflow-hidden` — it cuts focus rings and shadows); never to hide text that doesn't fit |
| `rotation` | `rotate-*` (mostly decor) |
| `constraints` | only for absolute children: MIN = left/top, MAX = right/bottom, CENTER, STRETCH = inset-x-0, SCALE = % |

## Interactive elements (Figma rarely draws hover/focus — add them anyway)
- Anything clickable is `<a href>` (goes somewhere) or `<button type="button">` (does something) — never a `div` with `onClick`.
- **Cursor:** Tailwind v4 gives buttons `cursor: default`. With the first tokens add to `app/globals.css`:
  ```css
  @layer utilities {
    /* :where() = zero specificity, so cursor-not-allowed / cursor-wait classes still win */
    :where(button:not(:disabled), [role="button"]:not(:disabled)) { cursor: pointer; }
  }
  ```
  (In `@layer base` the rule can lose to base styles imported later, e.g. from shadcn — Coffea needed `utilities`. A plain `button:not(:disabled)` in `utilities` would beat every `cursor-*` class — keep `:where()`. Don't add `label` — a visible label of a checkbox gets `cursor-pointer` itself.)
- **Hover** on every link and button, subtle and in the design's palette: `hover:bg-primary/90`, `hover:opacity-80`, `hover:underline`, `hover:bg-white/90` on light pills. Text links in footers/nav: `hover:underline` or `hover:opacity-80`.
- **Focus:** `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current` (or `ring-*`) — never `outline-none` without a replacement. On an input inside a pill, put the focus style on the pill (`focus-within:`).
- **Logo** in header and footer = `<a href="/" aria-label="<Brand> — home">`.
- **Icon that looks clickable** (heart, arrows, search, social): `<button type="button" aria-label="…">` or a link with `aria-label`; icon `aria-hidden`; hit area ≥ 44 px on touch widths, visual size from Figma. A button without logic yet ("Add to favorites") gets a `// TODO: logic` comment; toggles get `aria-pressed`.
- Purely decorative icons stay `aria-hidden`, with no hover and no pointer — don't make them look clickable.
- `section-check` reports `no pointer cursor` (≥ 1024) and `no hover state` (design width).

## Forms (UI only — logic is a separate task)
`<form>` · `<input type="email" name="email">` (or the right type) with a `<label>` — visible if the design has one, otherwise `sr-only` · `<button type="submit">` · inputs `text-base` (16 px, no iOS zoom) · below `md:` input and button stacked, both `w-full`, `min-h-11` · placeholder text from the design.

## Components (by layer / component names)
Button → shadcn `Button` (variants via cva) · FAQ / accordion → `Accordion` · inputs → `Input`, `Textarea`, `Label` · mobile menu → `Sheet` · tabs → `Tabs` · modal → `Dialog`.
Prefer these over hand-made menus, accordions and modals. `shadcn init` already installed `radix-ui`, so `add` usually only writes `components/ui/<name>.tsx` — still ask before running `pnpm dlx shadcn@latest add <name>` (it can add dependencies).

## Assets
- small vector icons (16–32 px, `VECTOR` / icon component) → `lucide-react` icon **by the Figma layer name** (`arrow-right` → `ArrowRight`, `mdi:heart-outline` → `Heart`, not a look-alike chevron); brand/custom icons → SVG export.
- logos, illustrations made of vectors → SVG; photos and raster art → JPG `scale: 2`.
- cut-outs (a picture with a transparent background) → PNG `scale: 2` (JPG turns transparency into white). A cut-out look made with a white background + multiply → JPG + `mix-blend-multiply` (Paint table).
- the same picture on both sides (decor): reuse one file with `scale-x-[-1]` only if Figma shows the same image flipped; a different picture or a different crop → export each node.
- full-bleed background images → JPG `scale: 2` (needed for 2560 px screens).
- alt text: look at the image and describe it (`"Latte with heart art on a wooden table"`); decorative → `alt=""`. Never a placeholder marker in `alt`.
- an asset re-exported in another format (JPG → PNG for transparency) → delete the old file; no unused files in `public/images/<id>/`.

## Tokens (first section) — Tailwind v4 + shadcn
- **Colors:** set the shadcn variables in `:root` of `app/globals.css` by role: `--background` (page bg), `--foreground` (main text), `--primary` / `--primary-foreground` (main CTA), `--secondary`, `--muted-foreground` (secondary text), `--accent`, `--card`, `--border`, `--ring`. Extra brand colors → `--brand-*` in `:root` + `--color-brand-*: var(--brand-*)` in `@theme inline`. Hex values are fine inside variables.
- **Fonts:** `next/font` with `variable: "--font-<name>"`, then `@theme inline { --font-sans: var(--font-<name>); --font-display: var(--font-<other>); }`. A third family used by a few sections → its own token/utility (`font-alt`), applied only there; never replace `--font-sans` to fit one section (it silently changes every finished section).
- **Type scale, section padding, spacing between sections, container, breakpoint 3xl:** see `breakpoints.md`.
- **Radius / shadow:** `--radius` (shadcn base) + `--radius-card`, `--shadow-card` etc. in `@theme`.
- Name by role, not by Figma names (`primary/500` → `--primary`). If Figma has variables (`get_variable_defs`), reuse their structure.

## Spec values (for `design/<id>.spec.json`)
- `lineHeight` in px: PIXELS → value; PERCENT → fontSize × value / 100; AUTO → omit.
- `letterSpacing` in px: PIXELS → value; PERCENT → fontSize × value / 100.
- `color` / `bg`: only solid fills with opacity 1 (the checker compares hex); skip gradients, images and semi-transparent fills.
- `radius`: `cornerRadius` (top-left corner when `cornerRadii` differ).
- `x`/`y`: sum `bounds.x/y` of the node and its parents up to the section.
- `gap`: `autoLayout.gap`; `rowGap` = `counterAxisSpacing` for wrapped rows.
- `h` on text with 2+ lines: the text node's `bounds.height` (lets the checker spot Vertical trim). `h` on cards and sections is diagnostic — it tells you something inside is off, it is never a reason for `h-*`.
- Absolutely positioned icons/badges/controls/decor images: `x y w h` from bounds (summed up to the section).
- `texts` (text map): for every TEXT node `characters`, `x`/`y` summed up to the section frame, `w` = `bounds.width`, `align` = `textAlignHorizontal`. Keep `characters` exactly as in Figma, typos included — the checker matches by similarity.
