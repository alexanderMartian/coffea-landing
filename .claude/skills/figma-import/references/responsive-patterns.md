# Responsive patterns (desktop frame → all widths)

Pick one pattern per block. "Signal" = what you see in `get_node` / the reference image.

## General rules
1. **DOM order = mobile reading order.** Change visual order on desktop only (`lg:order-*`), never the other way round.
2. **Never hide content or CTAs** on mobile. Only decor may hide (`hidden lg:block`). Hiding anything else → ask.
3. **Alternating (zig-zag) layouts lose the alternation on mobile** — same order in every row.
4. **No new dependencies** for sliders: use CSS scroll-snap (pattern 11) or a grid.
5. **The desktop structure starts at `lg:` (1024)** unless the block is too dense — then `xl:`.
6. Decor must never cause horizontal scroll: anchor it to the container and put `overflow-x-clip` on the section.

## 1. Header / navigation
Signal: logo + row of links + button at the top. → 360–1023: logo + burger (shadcn `Sheet`, links stacked, CTA inside the sheet and optionally a small CTA next to the burger) · `lg:` links in a row. Sticky only if the design implies it. Burger button ≥ 44 px, `aria-label`.

## 2. Split hero / split block (text + media side by side)
Signal: horizontal auto layout, 2 children ≈ equal width (or 5/7). → mobile: stack — text first, media below (media first only if the block is visual-led, e.g. product shot) · `lg:` 2 columns (`grid lg:grid-cols-2` or `lg:grid-cols-[5fr_7fr]`), `items-center` · ≥1920 design.
Headline uses the fluid display token; CTA group stacks full-width on mobile.

## 3. Centered hero over a background image
Signal: full-width image fill, centered text on top. → image full-bleed `fill object-cover`, a gradient/overlay token so text stays readable at every width (the crop changes), text centered in the container, min height `min-h-[70svh] lg:min-h-[design]`. Export the image at scale 2.

## 4. Card grid
Signal: N similar children (same component / same size), horizontal or wrapped. → `grid` with columns from the breakpoints table (1 → 2 → N). Cards: same internal padding at all widths, equal heights (`h-full` + flex column, CTA pinned with `mt-auto`).

## 5. Feature list (icon + title + text rows)
Signal: repeated small icon + text groups. → mobile: single column, icon left of text (`flex gap-4`) or icon above for centered designs · `md:` 2 cols · `lg:` design count.

## 6. Alternating rows (zig-zag)
Signal: rows where image and text swap sides. → mobile: every row = image then text (or text then image — pick one, same for all) · `lg:` restore alternation with `lg:order-last` on every second media.

## 7. Steps / process / timeline (horizontal with arrows or lines)
Signal: numbered items in a row, connectors between them. → mobile: vertical list, number on the left, connector as a vertical line (`border-l`) or hidden · `lg:` horizontal as in design; connectors are decor (`aria-hidden`).

## 8. Stats / numbers row
Signal: 3–4 big numbers with labels. → mobile: `grid-cols-2` (3 items: last spans 2 or single column) · `lg:` one row. Numbers use a fluid token.

## 9. Logo strip / partners
Signal: row of small logos. → mobile: `grid grid-cols-3` (or 2), logos `h-8 w-auto object-contain` · `lg:` one row `justify-between`. No marquee unless the design animates it.

## 10. Pricing
Signal: 2–4 plan cards, one highlighted. → mobile: stacked cards in design order (highlighted plan keeps its accent, no reordering without asking) · `md:` 2 cols when 2 or 4 plans · `lg:` design. Feature comparison tables → keep a table inside `overflow-x-auto` with a sticky first column, or convert to per-plan lists (ask).

## 11. Testimonials / horizontal list wider than the screen
Signal: row of quotes or cards that wouldn't fit in 360. → mobile: CSS scroll-snap row (`flex overflow-x-auto snap-x snap-mandatory gap-4 -mx-4 px-4`, children `snap-start shrink-0 basis-[85%]`) or a simple stack · `lg:` grid as in design. The scroller lives inside the section — no page overflow.

## 12. FAQ
Signal: list of questions, often title on the left and list on the right. → shadcn `Accordion` (single, collapsible) · mobile: title above the list · `lg:` 2 columns as in design.

## 13. Contact / form block
Signal: form + contact info or image. → mobile: stack, form first if it is the goal of the block · inputs full width, `text-base`, labels visible · `lg:` split as in design. Form logic is a separate task — build the UI only.

## 14. Footer
Signal: logo + several link columns + bottom bar. → mobile: logo/info, then link groups in `grid-cols-2`, bottom bar stacked and centered/left · `md:` more columns · `lg:` design.

## 15. Decorative elements (blobs, shapes, rotated labels, background patterns)
Signal: absolute nodes overlapping content, not text. → `aria-hidden`, positioned relative to the container, scaled down (`scale-75 lg:scale-100`) or hidden below `lg:` if they cover content. Never let them create overflow.

## 16. Big display text / marquee words
Signal: oversized headline, often edge to edge. → fluid token, `text-balance`, allow 2–3 lines on mobile; never shrink below the mobile minimum to force one line.

## 17. Button groups
Signal: 2+ buttons in a row. → mobile: `flex flex-col gap-3`, each `w-full` · `sm:` `flex-row`, `w-auto`.

## 18. Media embeds (video, map)
→ `aspect-video w-full`, lazy (`loading="lazy"`), poster image for video.

## Writing the plan
For every block: pattern number + what happens at 360 / 768 / 1280 / ≥1920. If no pattern fits, describe the closest one and adapt; if the adaptation changes content, ask.
