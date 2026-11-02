---
name: landing
description: Orchestrator for a client landing project. Reads the Project status block in CLAUDE.md, detects the current phase (scaffold / build / qa / done) and routes to the right skill or tells the next step. Use when the user runs /landing or asks "what's next" on a landing project.
---

# /landing — orchestrator

1. Read `## Project status` at the top of `CLAUDE.md`. If it is missing or still has `<...>` placeholders, ask the user for the missing fields (business, Figma URL) and fill them in. Sections are mapped from Figma by `figma-import` step 1. Set `Phase: scaffold`.
2. Act by phase. Do one step, then report in 2–3 lines (Ukrainian) and stop.

| Phase | What to do |
|---|---|
| `scaffold` | Check: `package.json` exists, `.claude/` and `scripts/` are copied, `qa:*` scripts are in `package.json`, `.gitignore` has `.qa/` and `design/*.png`, the `figma-bridge` MCP tool `list_files` returns the design file (Figma Desktop open + Figma MCP Bridge plugin running). Tell the user only the missing items (commands: "Новий проєкт з нуля" in `landing-claude-kit/README.md`). When all pass → set `Phase: build`. |
| `build` | Take the first section marked 🔄, otherwise the first ⬜. Run the `figma-import` skill for that section. When all sections are ✅ → run `node scripts/section-check.mjs --page` (must be OK), set `Phase: qa` and tell the user that Figma is no longer needed: `Rename-Item .mcp.json .mcp.json.off` stops the Figma MCP Bridge server from starting in this project (explain the command in one line). |
| `qa` | Suggest, in this order: `visual-qa` (dev server running), `/seo-setup` if not done, `landing-auditor` (needs the production build: the user runs `pnpm prod` → port 3001; dev on 3000 can keep running), `code-reviewer`. Never launch an agent yourself — name it and wait for the user to ask. When there are no Critical issues → set `Phase: done`. |
| `done` | Handover checklist: `PLACEHOLDER` comments resolved (grep the repo) and no lorem ipsum left, form tested on production, domain + HTTPS, analytics receiving data, Lighthouse ≥ 90 mobile. Before giving the repo to a client: remove `design/` (and optionally the `data-spec` attributes). Report what's left. |

3. Always end with one line: `Next: <exact command or skill>`.

## Rules
- If the user asks for Figma work and `.mcp.json` is missing but `.mcp.json.off` exists, tell them to run `Rename-Item .mcp.json.off .mcp.json` and restart Claude Code.
- The `Phase:` line and the section table in `CLAUDE.md` are the only source of truth. Update them; never track progress elsewhere.
- No implementation details here — they live in `figma-import`, `seo-setup`, `client-copy` and the agents.
- Don't skip phases. If the user asks to jump ahead, warn once in one line, then do what they ask.
