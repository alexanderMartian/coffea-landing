---
name: figma-import
description: Builds one landing section at a time from a Figma desktop frame through the Figma MCP Bridge — pulls the section once (spec + reference image + assets), plans responsive behaviour from patterns, codes it mobile-first for 360–2560 px, verifies the design width by numbers and pixel diff, verifies other widths by layout rules, then commits. Use when the user runs /figma-import, asks to build a section from Figma, or /landing routes to the build phase.
---

# Figma import — one section per run

## Principles
1. **The design is the truth only at its frame width** (usually 1920). Every other width (360–1440, 2560) follows `references/responsive-patterns.md` and `references/breakpoints.md`, not guesses.
2. **Numbers over eyes.** Spec mismatches from `scripts/section-check.mjs` are fixed first; images are a final check for what numbers can't catch.
3. **Figma once per section.** Pull everything into `design/` in step 3; later iterations never call Figma again.
4. **One section per run, end to end:** desktop match → all widths → lint/typecheck → status → commit. Never start the next section in the same run.
5. **Keep the Pro limit:** read at most ~5 images per section (budget below). Prefer text reports.

## Tools (MCP server `figma-bridge`, read-only)
| Need | Tool |
|---|---|
| Is the plugin connected | `list_files` |
| Page → frames → sections | `get_design_context` (no selection = current page, `depth: 2`) |
| Full tree of one section | `get_node` with the section node id |
| Tokens | `get_variable_defs`, `get_styles` |
| Reference image, assets → files | `save_screenshots` |

Edit tools are denied in `.claude/settings.json` — never try to change the Figma file.

## 0. Preconditions — check, stop with a short Ukrainian message if any fails
- `list_files` returns the design file. If not: «Відкрий Figma Desktop → копію макета → Plugins → Development → Figma MCP Bridge і напиши "далі"». The file must be a copy in the user's drafts (the plugin needs edit access on the free plan).
- The connected file is the right one: its `fileName` must match the `Figma file:` line in `CLAUDE.md`. If the line is empty (first run), write the name there. If it differs, or several files are connected, stop and ask which file to use — never build from another file. With several files connected, pass `fileKey` to every Figma call.
- Dev server: `node scripts/visual-check.mjs --ping`. If down, ask the user to run `pnpm dev`. Never start servers yourself.
- `CLAUDE.md` has `## Project status`.
- Claude Code runs from the project root (Bridge writes files relative to that folder).

## 1. Map the sections (only when the status table has no node ids)
- `get_design_context` with `depth: 2`. It reads the selection if something is selected (`selectionCount > 0`) — then either the selection is the desktop frame, or ask the user to press Esc in Figma and call again. Find the desktop frame (width ≈ 1920). Its direct children are the sections. If there are several candidate frames, or a mobile frame (≈ 360–430 wide) exists, ask which is which.
- Fill the status table: Section (clean name), `id` (kebab-case, unique — becomes `<section id>`), Figma node (`12:345`), ⬜. Add `Design frame: <node id>, <W>×<H>` above the table.
- Show the table in one message and ask to confirm (merge / split / skip, layer names like "Frame 247"). Wait for the answer.

## 2. Tokens and fonts (first section only; extend when new values appear)
- `get_variable_defs` and `get_styles`. Many files have none — then collect tokens from the section values in step 3.
- Map per `references/figma-mapping.md` → Tokens: colors into the shadcn variables + brand extras, fonts, type scale (fluid tokens per `references/breakpoints.md`), radii, shadows, content width. Write into `app/globals.css`. Fonts via `next/font`; a font that isn't on Google Fonts → ask for files (`next/font/local`).
- Set `Tokens: ✅` in the status.

## 3. Pull the section (once)
1. `get_node` with the section's node id. If the response is huge (≈150+ nodes), call `get_node` per direct child instead.
2. `save_screenshots` (Bridge never overwrites files — when re-pulling, `Remove-Item` the old ones first):
   - reference: `{ nodeId: <section>, outputPath: "design/<id>.png", format: "PNG", scale: 1 }`
   - photos → `public/images/<id>/<name>.jpg` (`format: "JPG"`, `scale: 2`); logos and illustrations → `.svg` (`format: "SVG"`). Generic icons → `lucide-react` instead of exporting. Kebab-case names.
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
   - Props: `x y w h` (px, relative to the Figma frame's top-left), `fontSize lineHeight fontWeight letterSpacing fontFamily color bg radius paddingTop paddingRight paddingBottom paddingLeft gap rowGap columnGap`. Unit conversions are in `references/figma-mapping.md`.
   - `x`/`y` only for anchors not placed by auto layout (sum the parents' `bounds` up to the section). Omit `w` for hug text (`textAutoResize: WIDTH_AND_HEIGHT`) and for fill children. Never invent values — only what `get_node` returned.
4. Copy texts verbatim into `content/site.ts`. Lorem ipsum or obvious drafts → `[PLACEHOLDER: ...]`.

## 4. Responsive plan
Read `references/responsive-patterns.md`. Split the section into blocks, pick one pattern per block, post the plan (max 8 lines):
```
Block             Pattern       360           768        1280        ≥1920
Text + image      split         stack, img↓   stack      2 cols      design
Feature cards ×4  card-grid     1 col         2 cols     4 cols      design
```
Continue without waiting. Ask one question only if a choice changes content (hiding something on mobile, reordering).

## 5. Build — mobile-first, all widths in one pass
Read `references/figma-mapping.md` and `references/breakpoints.md` first.
- `components/sections/<Name>.tsx`, Server Component, `<section id="<id>">`. `data-spec="<key>"` on every spec element. Client-only parts (menu, accordion, form) in small separate components.
- Render it in `app/page.tsx` inside `<main>` in design order (Header/Footer may go to `app/layout.tsx`). Without this the checker can't find the section.
- Base classes = 360 px, then `md:` `lg:` `xl:` `2xl:` `3xl:`. Design values land at `3xl` (1920) or are the max of a fluid token.
- Translate Figma structure, don't copy coordinates: auto layout → flex/grid + gap + padding; fixed text widths → `max-w-*`; content width from the token; full-bleed backgrounds.
- Tokens only (no raw hex, no `text-[#...]`). Images: `next/image` with real `sizes`; `priority` only on the hero image.

## 6. Verify the design width (loop, max 3 iterations)
1. `node scripts/section-check.mjs <id> --widths 1920`
2. Fix every spec mismatch it prints (`hero-title fontSize: ours 64 ≠ design 72`). Numbers win over impressions.
3. When the spec is clean, open `.qa/sections/<id>-diff.png` once: red = differs from Figma. Look for what numbers miss — missing or extra elements, order, image crop, alignment, icons, decor. Open `design/<id>.png` only if the diff is unclear.
4. Ignore thin red outlines around glyphs (font rendering), pixel diff ≤ ~3% with a clean spec, and anything under 2 px.
5. Anti-oscillation: never undo a fix unless the next measurement got worse. If the same property flips twice, stop and report it.
6. After 3 iterations, stop and list what still differs and why (missing font, longer copy, image crop).

## 7. Verify all widths (max 2 rounds)
1. `node scripts/section-check.mjs <id>` — 360, 768, 1024, 1280, 1440, 1920, 2560.
2. Fix every "Layout rules" item and every "content stretches beyond design".
3. Always look at `.qa/sections/<id>-360.png`; other widths only if they have issues. Check against the plan: hierarchy, spacing rhythm, CTA visible without hunting, nothing cramped.
4. The full run re-checks 1920 — desktop must not regress.

## 8. Finish
- `pnpm lint`, then `pnpm typecheck`; fix until both pass.
- Status table: section → ✅; Notes = known differences or placeholders.
- Propose the commit (`feat(<id>): build section from Figma`) with the file list. Commit only after the user says yes.

## Image budget per section
`design/<id>.png` (0–1) · `<id>-diff.png` (1–2) · `<id>-360.png` (1) · flagged widths (0–2). Never re-read `get_node` output — the spec file is the memory.

## Report (Ukrainian, max 8 lines)
```
<Section> ✅ — spec 14/14 · pixel diff 2.1% · 7 widths OK
Fixed: <short list>
Left: <none | differences and why>
Placeholders: <none | list>
Next: /figma-import <next section> (or /landing)
```

## Stop and ask when
Bridge not reachable · font not on Google Fonts · section boundaries unclear · a responsive choice hides or reorders content · a mobile frame exists (use it as the 360 reference instead of patterns) · still mismatching after 3 iterations.

## Don't
- Don't call `get_node` on the whole page, and don't re-pull a section unless the design changed.
- Don't touch other sections' files, install packages, add fonts without asking, or hardcode copy.
- Don't use the `visual-qa` agent here — it checks technical bugs, not design match.
