---
name: figma-import
description: Builds one landing section at a time from a Figma desktop frame through the Figma MCP Bridge — maps the page (sections + spacing), pulls the section once (spec + reference image + assets), plans responsive behaviour from patterns, codes it mobile-first for 360–2560 px, verifies the design width by numbers and pixel diff, verifies other widths by layout rules and the whole page by section positions, then commits. Use when the user runs /figma-import, asks to build a section from Figma, or /landing routes to the build phase.
---

# Figma import — one section per run

## Principles
1. **The design is the truth only at its frame width** (usually 1920). Every other width (360–1440, 2560) follows `references/responsive-patterns.md` and `references/breakpoints.md`, not guesses.
2. **Numbers over eyes.** Spec mismatches from `scripts/section-check.mjs` are fixed first; images are a final check for what numbers can't catch.
3. **Figma once per section.** Pull everything into `design/` in step 3; later iterations never call Figma again.
4. **One section per run, end to end:** desktop match → all widths → page positions → lint/typecheck → status → commit. Never start the next section in the same run.
5. **Keep the Pro limit:** read at most ~5 images per section (budget below). Prefer text reports.
6. **The spec and the tools describe the design, not our code.** Never change spec values, `scripts/` or `.claude/` to make a check pass. If a check looks wrong, report it — tool fixes go to the kit after review. Allowed spec edits: add a missing element from Figma; drop `h` of a content-driven block; fix a value that was copied wrong from Figma (say so in a `_note`).
7. **Height comes from content.** No fixed heights on text, cards or sections (`references/figma-mapping.md` → Sizes). A height mismatch means typography or spacing is off — find which.

## Tools (MCP server `figma-bridge`, read-only)
| Need | Tool |
|---|---|
| Is the plugin connected | `list_files` |
| Page → frames → sections (+ their bounds) | `get_design_context` (no selection = current page, `depth: 2`) |
| Full tree of one section | `get_node` with the section node id |
| Tokens | `get_variable_defs`, `get_styles` |
| Reference image, assets → files | `save_screenshots` |

Edit tools and `run_script` are denied in `.claude/settings.json` — never try to change the Figma file.
Not exported by the Bridge — check the reference image or ask the user: text case (UPPERCASE), Vertical trim (`leadingTrim`), child fill/hug sizing. Check `blendMode` on image nodes when it is present (`MULTIPLY` → `mix-blend-multiply`).

## 0. Preconditions — check, stop with a short Ukrainian message if any fails
- `list_files` returns the design file. If not: «Відкрий Figma Desktop → копію макета → Plugins → Development → Figma MCP Bridge і напиши "далі"». The file must be a copy in the user's drafts (the plugin needs edit access on the free plan).
- The connected file is the right one: its `fileName` must match the `Figma file:` line in `CLAUDE.md`. If the line is empty (first run), write the name there. If it differs, or several files are connected, stop and ask which file to use — never build from another file. With several files connected, pass `fileKey` to every Figma call.
- Dev server: `node scripts/visual-check.mjs --ping`. If down, ask the user to run `pnpm dev`. Never start servers yourself.
- `CLAUDE.md` has `## Project status`.
- Claude Code runs from the project root (Bridge writes files relative to that folder). In Bash use relative paths (`scripts/…`, `design/…`).

## 1. Map the page (only when the status table has no node ids or `design/page.json` is missing)
1. `get_design_context` with `depth: 2`. It reads the selection if something is selected (`selectionCount > 0`) — then either the selection is the desktop frame, or ask the user to press Esc in Figma and call again. Find the desktop frame (width ≈ 1920). If there are several candidate frames, or a mobile frame (≈ 360–430 wide) exists, ask which is which.
2. **Sections = direct children of the desktop frame that are frames.** If the children are mostly loose texts, rectangles, groups and images (a flat design), propose a split by y-ranges (name + y from–to) and ask the user to wrap each range into a frame in their copy: select the layers → `Ctrl + Alt + G` → rename. Then call again.
3. Fill the status table: Section (clean name), `id` (kebab-case, unique — becomes `<section id>`), Figma node (`12:345`), ⬜. Add `Design frame: <node id>, <W>×<H>` above the table.
4. Write **`design/page.json`** — the page map, from the section frames' bounds (y relative to the design frame):
```json
{
  "pageWidth": 1920,
  "sections": [
    { "id": "header", "nodeId": "2013:2", "y": 55, "height": 61, "overlay": true },
    { "id": "hero", "nodeId": "2013:3", "y": 0, "height": 1000, "gapBefore": 0 },
    { "id": "menu", "nodeId": "2013:5", "y": 1300, "height": 677, "gapBefore": 80 }
  ]
}
```
   - `gapBefore` = this `y` − (previous `y` + previous `height`), in design order. A frame that lies over another one (header over hero) gets `"overlay": true` and no gap.
   - A gap < 0 (frames overlap) or an odd value (1–7 px) → show it and ask; never guess.
5. Show the table **with `gapBefore`** in one message and ask to confirm (merge / split / skip, layer names like "Frame 247"). Wait for the answer.

## 2. Tokens and fonts (first section only; extend when new values appear)
- `get_variable_defs` and `get_styles`. Many files have none — then collect tokens from the section values in step 3.
- Map per `references/figma-mapping.md` → Tokens: colors into the shadcn variables + brand extras, fonts, type scale (fluid tokens per `references/breakpoints.md`), radii, shadows, content width. Write into `app/globals.css`. Fonts via `next/font`; a font that isn't on Google Fonts → ask for files (`next/font/local`).
- **Section spacing:** one `@utility mt-section-<name>` per distinct `gapBefore` > 0 in `design/page.json` (fluid, `references/breakpoints.md` → Spacing between sections).
- **Several font families:** never swap a family globally to fit one section. Add a separate token/utility for the extra family and use it only where Figma uses it. Tell the user when the design uses more than 2 families.
- Set `Tokens: ✅` in the status.

## 3. Pull the section (once)
1. `get_node` with the section's node id. If the response is huge (≈150+ nodes), call `get_node` per direct child instead.
   - **Repeated section** (same structure as a section already built, e.g. a second product carousel): don't run steps 4–5 again. Read only the heading and text nodes, reuse the component, add the data, copy the spec with new keys/node ids, check. Any change to the shared component → agree with the user, then re-check every section that uses it.
2. `save_screenshots` (Bridge never overwrites files — when re-pulling, `Remove-Item` the old ones first):
   - reference: `{ nodeId: <section>, outputPath: "design/<id>.png", format: "PNG", scale: 1 }`
   - photos → `public/images/<id>/<name>.jpg` (`format: "JPG"`, `scale: 2`); logos and illustrations → `.svg` (`format: "SVG"`). Generic icons → `lucide-react` instead of exporting. Kebab-case names.
   - Re-exported an asset in another format → delete the old file before the commit.
3. Write `design/<id>.spec.json` — 6–15 elements that define the look (section box, headings, one body text, buttons, one representative card, media, auto-layout containers):
```json
{
  "section": "hero",
  "nodeId": "12:345",
  "frame": { "width": 1920, "height": 860 },
  "elements": {
    "hero":       { "h": 860, "paddingTop": 120, "paddingBottom": 120, "bg": "#0b0b12" },
    "hero-title": { "w": 760, "fontSize": 72, "lineHeight": 80, "fontWeight": 700, "letterSpacing": -1.44, "color": "#ffffff", "fontFamily": "Inter" },
    "hero-cta":   { "x": 360, "y": 520, "w": 220, "h": 56, "radius": 12, "bg": "#5b5bf7", "color": "#ffffff", "fontSize": 18 },
    "hero-media": { "w": 720, "h": 640, "radius": 24 }
  }
}
```
   - `frame`: `width`/`height` of the Figma section frame. If the frame is narrower than the page (e.g. 1760 inside 1920) or starts below the top of our `<section>` (header overlay), add `"x"` = its `bounds.x` in the design frame, `"y"` = its offset from the top of our `<section>` (usually 0) and `"pageWidth"` = design frame width (1920). The checker then compares only that area. In that case don't put `w`/`h` on the section key.
   - Keys = `data-spec` values in the code; the section's own key = its `id` (no `data-spec` on `<section>`).
   - Props: `x y w h` (px, relative to the Figma frame's top-left), `fontSize lineHeight fontWeight letterSpacing fontFamily color bg radius paddingTop paddingRight paddingBottom paddingLeft gap rowGap columnGap`. Unit conversions are in `references/figma-mapping.md`. Keys starting with `_` are notes, ignored by the checker.
   - `x`/`y` only for anchors not placed by auto layout (sum the parents' `bounds` up to the section). Omit `w` for hug text (`textAutoResize: WIDTH_AND_HEIGHT`) and for fill children. Never invent values — only what `get_node` returned.
   - **Must be in the spec:** every absolutely positioned icon, badge, control or decorative image (a heart over a photo, carousel arrows, dots, side decor) with `x y w h`; `x`/`y` of the main elements of a centered block (input, button, subtitle); `x`/`y` of **every** item in a row of repeated items (each column heading, each card) — not only the first and the last; every text with 2+ lines with `h` (the checker uses it to detect Vertical trim).
   - **`texts` — the text map:** every visible TEXT node of the section (max ~40; for repeated cards only the first card), copied from `get_node`: `{ "text": "<characters>", "x": …, "y": …, "w": …, "align": "LEFT|CENTER|RIGHT" }` — x/y summed up to the section frame, `w` = text box width, `align` = `textAlignHorizontal`. The checker finds each text on the page (typo-tolerant) and reports any text that is off by more than 3 px. It catches shifts the elements list doesn't cover (Footer: columns 2–4 were 22–70 px off with spec 31/31).
```json
"texts": [
  { "text": "PRIVACY", "x": 459, "y": 96, "w": 99, "align": "LEFT" },
  { "text": "Join in and ger 15% off!", "x": 777, "y": 88, "w": 366, "align": "CENTER" }
]
```
4. Texts → `content/site.ts` **verbatim**, Lorem ipsum included. Fake copy gets a code comment above the field — `// PLACEHOLDER: lorem from the design` — never a marker inside the rendered string or `alt`. Real design texts (names, prices, buttons) are not placeholders. `PLACEHOLDER` means only "fake copy to replace" (it is grepped at handover) — typo fixes get `// Typos fixed vs design: "ger" → "get"`, questions get `// NOTE: …`.
   - **Case:** compare every heading, nav item and logo with `design/<id>.png` — Bridge doesn't export UPPERCASE. Keep `characters` as written, add `uppercase` when the image shows caps.
   - **Typos** ("Out Products", "INFOTNATION"): fix obvious ones and list each as «було → стало» in the report — the user confirms with the client (brand names and wordplay stay).
   - **Vertical trim:** a text box shorter than lines × lineHeight with all glyphs inside it means Figma Vertical trim ("Cap height to baseline"), not a design error. See `references/figma-mapping.md` → Text.

## 4. Responsive plan — mandatory stop
**Step 3 is finished before the plan:** spec (elements + texts), texts in `content/site.ts` and asset files are written. "No code before OK" means no component code — data files are part of step 3.
Read `references/responsive-patterns.md`. Split the section into blocks, pick one pattern per block, post the plan in Ukrainian (max 8 lines) — starting with what step 3 wrote (`design/footer.spec.json — 12 elements, 20 texts · 4 icons in public/images/footer/`) — **and stop**:
```
Block             Pattern       360           768        1280        ≥1920
Text + image      split         stack, img↓   stack      2 cols      design
Feature cards ×4  card-grid     1 col         2 cols     4 cols      design
```
Add one line for the spacing above the section (`mt-section-lg` = 80 px from `page.json`). Wait for the user's OK or corrections before writing code.

## 5. Build — mobile-first, all widths in one pass
Read `references/figma-mapping.md` and `references/breakpoints.md` first.
- `components/sections/<Name>.tsx`, Server Component, `<section id="<id>">`. `data-spec="<key>"` on every spec element. Client-only parts (menu, accordion, form) in small separate components.
- Render it in `app/page.tsx` inside `<main>` in design order (Header/Footer may go to `app/layout.tsx`). Without this the checker can't find the section.
- **Spacing above the section** comes from `design/page.json`: `className="mt-section-*"` on the section in `app/page.tsx` (margin, not padding — the gap stays outside the section's background). The section component accepts `className` and merges it with `cn()`; never hard-code the gap inside a reusable component. `gapBefore: 0` → no class.
- Base classes = 360 px, then `md:` `lg:` `xl:` `2xl:` `3xl:`. Design values land at `3xl` (1920) or are the max of a fluid token.
- Translate Figma structure, don't copy coordinates: auto layout → flex/grid + gap + padding; fixed text widths → `max-w-*`; content width from the token; full-bleed backgrounds.
- Tokens only (no raw hex, no `text-[#...]`). Images: `next/image` with real `sizes`; `priority` only on the hero image.
- Icons: by the Figma layer name (`arrow-right` → `ArrowRight`, not a chevron). Menus, accordions, dialogs → shadcn components, not hand-made ones.

## 6. Verify the design width (loop, max 3 iterations)
1. `node scripts/section-check.mjs <id> --widths 1920`
2. Fix every spec mismatch it prints (`hero-title fontSize: ours 64 ≠ design 72`). Numbers win over impressions. A `→ looks like Figma Vertical trim` hint: ask the user to confirm the setting in Figma, then apply the trim (figma-mapping.md → Text). Never cover a height difference with `h-*`, `max-h-*` + `overflow-hidden` or a magic gap.
3. Fix every `texts` line (`"Jobs" is off by x +70 px`) the same way — find which container is off, don't move single texts.
4. When spec and texts are clean, **always** open `.qa/sections/<id>-diff.png` (a low % proves nothing: a dark, sparse section hid a 70 px shift at 3%). Red = differs from Figma. Go through the `red zones` the checker lists and name each one: font rendering (thin outline of the same glyphs), a fixed typo (only those words), or a real difference — missing or extra element, order, image crop, white box around a photo (blend mode), alignment, icons, decor. **A word or shape drawn twice = a shifted element** → add it to the spec and fix the position. Open `design/<id>.png` only if the diff is unclear.
5. Pixel diff > 10% is reported as an issue by the checker — the section is not done until every red zone is explained and the real ones are fixed. Never write "expected" for a zone you haven't looked at; when the % grows between runs, read the diff image before explaining it.
6. Ignore thin red outlines around glyphs and anything under 2 px.
7. Anti-oscillation: never undo a fix unless the next measurement got worse. If the same property flips twice, stop and report it.
8. After 3 iterations, stop and list what still differs and why (missing font, longer copy, image crop).

## 7. Verify all widths and the page (max 2 rounds)
1. `node scripts/section-check.mjs <id>` — 360, 768, 1024, 1280, 1440, 1920, 2560.
2. Fix every "Layout rules" item and every "content stretches beyond design".
3. Always look at `.qa/sections/<id>-360.png`; other widths only if they have issues. Check against the plan: hierarchy, spacing rhythm, CTA visible without hunting, nothing cramped.
4. The full run re-checks 1920 — desktop must not regress.
5. `node scripts/section-check.mjs --page` — every built section must start at its Figma y at 1920 and must not touch or overlap its neighbours at any width. The report names the first section where the difference appears; fix that one (its gap or the height of the section above), not the ones below.

## 8. Finish
- `pnpm lint`, then `pnpm typecheck`; fix until both pass.
- **Shared changes:** if this run changed `app/globals.css`, `app/layout.tsx` or a component used by other sections, re-run `section-check` for every ✅ section that uses it, and `--page`.
- Status table: section → ✅; Notes = spec + texts count, pixel diff with what the red zones are, known differences, placeholders.
- **Commit = everything this section touched.** Run `git status`: every file this run changed or created must be in the list (component, `content/site.ts`, `app/page.tsx` / `app/layout.tsx` for fonts or placement, `app/globals.css`, `design/<id>.spec.json`, `design/page.json`, `public/images/<id>/`, `CLAUDE.md`). Ignored files (`design/*.png`, `.qa/`) stay out — never `git add -f`. (Coffea: a Testimonials commit missed the font in `layout.tsx` and the data in `site.ts` — it didn't build on its own.)
- Propose the commit (`feat(<id>): build section from Figma`) with the file list. Commit only after the user says yes. After the commit `git status` must show nothing from this section.

## Image budget per section
`design/<id>.png` (0–1) · `<id>-diff.png` (1–2) · `<id>-360.png` (1) · flagged widths (0–2). Never re-read `get_node` output — the spec file is the memory.

## Context hygiene
One section per session: after the commit, tell the user to run `/clear` before the next section. Never `get_node` a whole large section twice. Long tasks from the user arrive as `.qa/prompts/<name>.md` — read the file.

## Report (Ukrainian, max 10 lines)
```
<Section> ✅ — spec 14/14 · texts 20/20 · pixel diff 2.1% · 7 widths OK · page OK
Red zones: <each zone → what it is (typo fix / font rendering / …)>
Fixed: <short list>
Left: <none | differences and why>
Placeholders: <none | fields with // PLACEHOLDER>
Typos fixed: <none | «було → стало»>
Next: /clear, then /figma-import <next section> (or /landing)
```

## Stop and ask when
Bridge not reachable · font not on Google Fonts · flat design (no section frames) · section boundaries unclear · section frames overlap or a gap looks odd · a responsive choice hides or reorders content · a mobile frame exists (use it as the 360 reference instead of patterns) · Vertical trim suspected (confirm in Figma) · text glyphs really overflow their box in Figma (real design error: ask — exact visual match with a commented compensation, or honest spacing) · still mismatching after 3 iterations.

## Don't
- Don't call `get_node` on the whole page, and don't re-pull a section unless the design changed.
- Don't edit spec values, `scripts/` or `.claude/` to pass a check (principle 6).
- Don't put `h-*`, `max-h-*` + `overflow-hidden` or `line-clamp` on text to make it fit — even if the Figma frame has `clipsContent: true`.
- Don't render `[PLACEHOLDER …]` or invented copy ("Customer Name", "Role") — design texts verbatim, markers in code comments.
- Don't touch other sections' files, install packages, add fonts without asking, or hardcode copy.
- Don't use the `visual-qa` agent here — it checks technical bugs, not design match.
