# Project: Coffea landing

@AGENTS.md
<!-- Next.js rules for AI agents (created by create-next-app / next dev): read the bundled docs in node_modules/next/dist/docs/ before writing Next.js code. -->

Coffee shop landing: menu highlights (coffee, desserts), about, ordering CTA. Portfolio piece, built from a Figma Community template.
Package: portfolio (no client). Live URL: <not deployed yet>

## Project status
<!-- Filled at project start by /landing; updated after every section. The only source of truth for progress. -->
- Business: Coffea — coffee shop / café (fictional, template)
- Figma file: Coffea - Free Responsive Coffee Shop Website Template (Community)   <!-- figma-import checks it against the file open in Figma -->
- Figma link: <add the link of the copy> — a copy in my drafts, read through the Figma MCP Bridge plugin
- Design frame: 0:3, 1920×4343   <!-- filled by figma-import step 1 -->
- Phase: qa   <!-- scaffold | build | qa | done -->
- Tokens: ✅   <!-- ✅ when colors, fonts, type scale and spacing are in app/globals.css -->
- Lighthouse (production, 2026-11-03): mobile 86 (82–87, lab, median of 3), a11y/BP/SEO 100; 2026-11-02: mobile 89, desktop 99

| # | Section | id | Figma node | Status | Notes |
|---|---|---|---|---|---|
| 0 | Header | `header` | `2013:2` | ✅ | Nav bar, floats over Hero; in app/layout.tsx; pixel diff n/a (transparent bg) |
| 1 | Hero | `hero` | `2013:3` | ✅ | font diff ~3.6% (Playfair rendering) |
| 2 | Categories | `categories` | `2013:4` | ✅ | Poppins via font-alt (Outfit stays font-sans); pixel diff 1.8% |
| 3 | Coffee Menu | `coffee-menu` | `2013:5` | ✅ | ProductCard + ProductSection + CarouselRow; spec 34/34; pixel diff 3.9%; heart pos fixed |
| 4 | Dessert Menu | `dessert-menu` | `2013:6` | ✅ | Shared card component with Coffee Menu; spec 34/34; pixel diff 3.2%; heart pos fixed |
| 5 | Promo | `promo` | `2013:7` | ✅ | mix-blend-multiply on cutout photos; pixel diff 3.9% (photo rendering); CTA "Explore Our Products" (Figma typo "Out") |
| 6 | Testimonials | `testimonials` | `2013:8` | ✅ | spec 34/34; pixel diff 6.8% (avatar photo + placeholder content); uppercase heading; Reggae One added; mobile stack; text-box trim |
| 7 | Newsletter | `newsletter` | `0:239` | ✅ | spec 38/38; pixel diff 1.5%; mix-blend-multiply on bean photos; mobile stacked form; typos fixed: "ger"→"get", "in get"→"and get" |
| 8 | Footer | `footer` | `2013:9` | ✅ | spec 49/49; pixel diff 2.3% (red only on fixed typos); columns from Figma gaps; small-caps logo; social SVG icons; logo "Coffee" vs header "Coffea" — open question |

Status: ⬜ not started · 🔄 in progress · ✅ done (spec match at 1920 + rules OK at 360–2560 + lint/typecheck + committed)

## Stack
Next.js (App Router) + TypeScript · Tailwind CSS · shadcn/ui · lucide-react · Motion (`motion/react`) ·
React Hook Form + Zod · Route Handlers + Resend (or Telegram Bot API) for forms ·
next/image · next/font · Metadata API + sitemap + robots · Vercel Analytics or GA4 · Vercel · pnpm.
GSAP only if the client asked for it. Sanity CMS only in the Premium package.

## Commands
- `pnpm dev` — dev server on http://localhost:3000
- `pnpm lint` / `pnpm typecheck` / `pnpm format`
- `pnpm build` then `pnpm start` — production build (needed for Lighthouse)
- `pnpm qa:visual [paths...]` — screenshots + layout checks at 375/768/1440 (dev server must run)
- `pnpm qa:lh` — Lighthouse summary (production server must run)
- `node scripts/section-check.mjs <section-id> [--widths 360,1920]` — one section vs `design/<id>.*` + layout rules at 360–2560 → `.qa/sections/` (used by `figma-import`)
- `node scripts/section-check.mjs --page` — every section's position on the page vs `design/page.json` (gaps between sections)
- shadcn component: `pnpm dlx shadcn@latest add <name>`

## Structure
- `app/` — routes; `app/layout.tsx` holds fonts, metadata defaults, analytics
- `app/api/newsletter/route.ts` — newsletter signup endpoint (Resend)
- `components/ui/` — shadcn (generated; edit only when needed)
- `components/sections/` — one file per landing section (Hero, Services, Pricing, FAQ, Contact…)
- `content/site.ts` — ALL texts, links, prices, contacts. Components never hardcode copy.
- `lib/` — `utils.ts` (cn), `schemas.ts` (Zod schemas shared by client and server)
- `public/` — images, favicons (`public/images/<section-id>/` — assets exported from Figma)
- `design/` — Figma references: `page.json` (section positions and gaps), per section `<id>.png` (frame export) and `<id>.spec.json` (key values). Written by `figma-import`; `*.png` there is gitignored

## Conventions
- Server Components by default. `"use client"` only for interactivity (Motion, forms, toggles) and keep those components small.
- Mobile-first Tailwind. Check 360px first.
- No fixed heights on text, cards or sections: no `h-*`, no `max-h-*` + `overflow-hidden` on text. Height comes from content; sections use `min-h-*`; text width via `max-w-*`. Fixed sizes only for icons, avatars, dots.
- Spacing between sections: `mt-section-*` utilities (from `design/page.json`), set on the section in `app/page.tsx`; sections accept `className`.
- Colors, radii, fonts come from theme tokens — no raw hex values in components. Merge classes with `cn()`.
- Images: always `next/image` with `width`/`height` or `fill` + `sizes`. Only the hero (LCP) image gets `loading="eager"` + `fetchPriority="high"` (`priority` is deprecated in Next 16).
- Fonts: `next/font`, families as in the design, `display: "swap"`. An extra family gets its own token/utility; never swap `--font-sans` for one section.
- Animations: `/animate` standard package done — tokens in `globals.css`, `<Reveal>` wrapper + `RevealObserver`, hover via tokens; first screen never animated; no reveal/zoom on `mix-blend-multiply` images. Rules: added at the end with `/animate` — CSS first (tokens in `globals.css`, `data-reveal` + one `RevealObserver`, hover via Tailwind classes), the Motion library only for what CSS can't do (exit, layout, drag). Never animate the first screen on load; only transform/opacity; everything respects `prefers-reduced-motion`. Don't add animations while building sections.
- Forms: one Zod schema in `lib/schemas.ts` → `zodResolver` on the client AND `safeParse` in the route handler. Add a honeypot field. Return `{ ok: boolean, error?: string }`.
- Secrets only in env vars (`RESEND_API_KEY`, `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `CONTACT_TO_EMAIL`). Never `NEXT_PUBLIC_` for secrets. Keep `.env.example` updated.
- SEO: `metadata` in `app/layout.tsx` with `metadataBase`, title template, description, `openGraph`; `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.(png|tsx)`. Exactly one `<h1>` per page; `<html lang>` set.
- Accessibility: semantic tags (`header`, `main`, `section` with headings, `footer`), labels on all inputs, visible focus, links for navigation / buttons for actions, alt text on meaningful images (`alt=""` on decorative).
- TypeScript strict: no `any`, no unnecessary `!`.
- Never invent testimonials, reviews, client logos, stats or awards. Design copy (Lorem ipsum included) is rendered verbatim; fake copy is marked with a `// PLACEHOLDER: ...` comment above the field in `content/site.ts` — never inside the rendered text or `alt`. `alt` describes the image.

## Decisions
<!-- Deliberate choices. Reviewers and agents must not report these as problems. -->
- Portfolio / concept site: menu items, prices and copy are invented on purpose; testimonials are samples, labelled
  "Sample reviews — Coffea is a concept project." under the heading (2026-11-02).
- Placeholder links: links without a real target go to a section anchor or `/` (social icons, legal pages, login,
  about) — `// TODO: replace / with real URLs` (2026-11-02).
- Newsletter: Resend key not created yet; without `RESEND_API_KEY` / `NOTIFICATION_EMAIL` the endpoint answers 503 with
  a polite message — expected until deploy. No rate limiting (portfolio; honeypot only).
- Promo/Newsletter photos keep `mix-blend-multiply` and are not animated (2026-11-02).
- Lighthouse mobile 86–87 accepted (A/B showed the animations cost nothing; `inlineCss` was tried and made it worse;
  `zod/mini` skipped). Recheck with PageSpeed Insights after deploy.
- `motion` package stays installed but unused for now — decide at the end.

## Definition of Done
1. Section/feature done → `pnpm lint` and `pnpm typecheck` pass.
2. Before showing the client → `pnpm build` passes, then I run (or ask you to run) `visual-qa` and `landing-auditor`. Target Lighthouse ≥ 90 in every category on mobile.
3. Before deploy → `code-reviewer` on the full diff, no Critical items left.

## Don't
- Don't install packages, change the stack, or add a CMS without asking.
- Don't edit `components/ui/` wholesale or reformat files you didn't change.
- Don't start long-running processes you don't stop; tell me which server must be running instead.

# Compact instructions
When compacting, keep: current task and its acceptance criteria, files changed, failing checks and their errors. Drop exploration output and old screenshots.
