#!/usr/bin/env node
// Whole-page QA in a real browser, the way a visitor uses the page (complements section-check, which compares
// sections with Figma). Prints a short report and saves full-page screenshots to .qa/screenshots.
//
// Usage: node scripts/visual-check.mjs [baseUrl] [paths...]   e.g. node scripts/visual-check.mjs http://localhost:3000 / /privacy
//        node scripts/visual-check.mjs --ping [baseUrl]
//
// Every width (360 768 1024 1440 1920): console errors, page errors, failed requests / HTTP ≥ 400 (dev-server noise
// filtered), broken images, <img> without alt, number of <h1>, horizontal overflow, blocks stuck at opacity 0.
// Once per page: in-page anchor links (#id) that point nowhere, href="#" placeholders (info), mobile menu
// (360: open → links visible → link closes it; Escape closes it), keyboard walk with Tab (1440: visible focus on
// every stop, no focus on hidden elements).
import { mkdirSync } from "node:fs";
import { join } from "node:path";

const args = process.argv.slice(2);
const ping = args.includes("--ping");
const rest = args.filter((a) => a !== "--ping");
const base = rest[0]?.startsWith("http") ? rest.shift() : "http://localhost:3000";
// Git Bash (Windows) rewrites a "/path" argument into "C:/Program Files/Git/path" — undo that.
const unMsys = (p) => p.replace(/^[A-Za-z]:\/.*?\/Git(?=\/|$)/i, "") || "/";
const paths = rest.length ? rest.map(unMsys) : ["/"];
const WIDTHS = [360, 768, 1024, 1440, 1920];
const MENU_WIDTH = 360;
const KEYBOARD_WIDTH = 1440;
const OUT = join(".qa", "screenshots");

async function isUp(url) {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
    return res.status < 500;
  } catch {
    return false;
  }
}

if (!(await isUp(base))) {
  console.log(`SERVER DOWN: ${base} is not reachable`);
  process.exit(2);
}
if (ping) {
  console.log(`SERVER UP: ${base}`);
  process.exit(0);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("Playwright not installed: run `pnpm add -D playwright` and `pnpm exec playwright install chromium`");
  process.exit(2);
}

mkdirSync(OUT, { recursive: true });
// CHROME_PATH lets you use an installed Chrome instead of Playwright's Chromium.
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let total = 0;
const hits = {}; // issue -> widths (same problem at several widths is printed once)

// Dev server traffic that is not a bug on the page.
const NOISE = [/_next\/webpack-hmr/, /__nextjs/, /_next\/static\/webpack\//, /\/__webpack_hmr/, /favicon\.ico$/, /[?&]_rsc=/];
const isNoise = (url, err = "") => NOISE.some((r) => r.test(url)) || /ERR_ABORTED/.test(err);

async function openPage(width, path, problems) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  if (problems) {
    page.on("console", (m) => {
      if (m.type() !== "error") return;
      const t = m.text();
      if (/Download the React DevTools|\[HMR\]|\[Fast Refresh\]/.test(t)) return;
      problems.push(`console: ${t.slice(0, 160)}`);
    });
    page.on("pageerror", (e) => problems.push(`page error: ${String(e.message).slice(0, 160)}`));
    page.on("requestfailed", (r) => !isNoise(r.url(), r.failure()?.errorText) && problems.push(`request failed: ${r.url().slice(0, 120)} (${r.failure()?.errorText || ""})`));
    page.on("response", (r) => r.status() >= 400 && !isNoise(r.url()) && problems.push(`HTTP ${r.status()}: ${r.url().slice(0, 120)}`));
  }
  await page.goto(new URL(path, base).toString(), { waitUntil: "networkidle", timeout: 45000 });
  await page.addStyleTag({ content: "nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }" });
  return page;
}

const LABEL = () => {
  window.__label = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    const aria = el.getAttribute?.("aria-label");
    if (aria) s += `[${aria}]`;
    const text = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 28);
    return text ? `${s} "${text}"` : s;
  };
  window.__shown = (el) => {
    const r = el.getBoundingClientRect();
    const s = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05;
  };
};

// ---------- mobile menu ----------
async function checkMenu(page) {
  await page.evaluate(LABEL);
  const found = await page.evaluate(() => {
    const header = document.querySelector("header") || document.body;
    const btn = [...header.querySelectorAll("button, [role=button]")].find(
      (b) => window.__shown(b) && (b.hasAttribute("aria-expanded") || b.hasAttribute("aria-haspopup") || /menu|навіг|меню|nav/i.test(b.getAttribute("aria-label") || b.textContent || ""))
    );
    const visibleLinks = [...header.querySelectorAll("nav a[href]")].filter(window.__shown).length;
    if (btn) btn.setAttribute("data-qa-menu", "1");
    return { button: !!btn, label: btn ? window.__label(btn) : "", visibleLinks };
  });
  if (!found.button) return found.visibleLinks ? [] : ["mobile menu: no menu button and no visible nav links in <header> at 360"];
  const issues = [];
  const btn = page.locator("[data-qa-menu]");
  await btn.click({ timeout: 3000 });
  await page.waitForTimeout(900); // open animation
  const open = await page.evaluate(() => {
    // Prefer the dialog itself over overlays (Radix renders an overlay with data-state=open before the content).
    const linksIn = (d) => [...d.querySelectorAll("a[href]")].filter(window.__shown).length;
    const cands = [...document.querySelectorAll("[role=dialog], [aria-modal=true]")].filter(window.__shown);
    const fallback = [...document.querySelectorAll("[data-state=open]")].filter((d) => window.__shown(d) && d !== document.querySelector("[data-qa-menu]"));
    const dlg = (cands.length ? cands : fallback).sort((x, y) => linksIn(y) - linksIn(x))[0];
    const links = dlg ? [...dlg.querySelectorAll("a[href]")].filter(window.__shown) : [];
    if (links[0]) links[0].setAttribute("data-qa-menu-link", "1");
    return { dialog: !!dlg, links: links.length, expanded: document.querySelector("[data-qa-menu]")?.getAttribute("aria-expanded") };
  });
  if (!open.dialog) return [`mobile menu: ${found.label} doesn't open a visible menu (no role=dialog / data-state=open)`];
  if (!open.links) issues.push("mobile menu: opened, but has no visible links");
  if (open.expanded === "false") issues.push("mobile menu: aria-expanded stays false when open");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(700);
  const afterEsc = await page.evaluate(() => !![...document.querySelectorAll("[role=dialog], [aria-modal=true]")].find(window.__shown));
  if (afterEsc) {
    issues.push("mobile menu: Escape doesn't close it");
    return issues; // can't reopen reliably — skip the link test
  }
  if (open.links) {
    await btn.click({ timeout: 3000 });
    await page.waitForTimeout(900);
    const link = page.locator("[data-qa-menu-link]");
    if (await link.count()) {
      await link.first().click({ timeout: 3000 });
      await page.waitForTimeout(600);
      const stillOpen = await page.evaluate(() => !![...document.querySelectorAll("[role=dialog], [aria-modal=true]")].find(window.__shown));
      if (stillOpen) issues.push("mobile menu: stays open after clicking a link (anchor links should close it)");
    }
  }
  return issues;
}

// ---------- keyboard walk ----------
async function checkKeyboard(page) {
  await page.evaluate(LABEL);
  await page.evaluate(() => {
    const look = (el) => {
      const chain = [el, el.parentElement, el.parentElement?.parentElement].filter(Boolean);
      return chain.map((e) => { const s = getComputedStyle(e); return [s.outlineStyle, s.outlineWidth, s.outlineColor, s.boxShadow, s.borderColor, s.backgroundColor, s.textDecorationLine].join("|"); }).join("#");
    };
    window.__look = look;
    window.__base = new Map();
    window.__tabN = 0;
    for (const el of document.querySelectorAll("a[href], button, input, select, textarea, [tabindex]")) window.__base.set(el, look(el));
  });
  const noFocus = [], hidden = [], seen = new Set();
  let stops = 0;
  for (let i = 0; i < 150; i++) {
    await page.keyboard.press("Tab");
    const r = await page.evaluate(() => {
      const el = document.activeElement;
      if (!el || el === document.body) return null;
      const key = el.dataset.qaTab || (el.dataset.qaTab = String(++window.__tabN)); // identity, not text — 4 "Order Now" in a row are 4 stops
      return { key, label: window.__label(el), shown: window.__shown(el), changed: window.__look(el) !== window.__base.get(el) };
    });
    if (!r) break;
    if (seen.has(r.key)) break; // wrapped around or trapped
    seen.add(r.key);
    stops++;
    if (!r.shown) hidden.push(r.label);
    else if (!r.changed) noFocus.push(r.label);
  }
  const issues = [];
  if (noFocus.length) issues.push(`keyboard: no visible focus on ${noFocus.length}/${stops} stops: ${noFocus.slice(0, 4).join(" | ")}`);
  if (hidden.length) issues.push(`keyboard: focus lands on hidden elements: ${hidden.slice(0, 3).join(" | ")}`);
  return { stops, issues };
}

for (const path of paths) {
  const slug = path === "/" ? "home" : path.replace(/^\/+|\/+$/g, "").replace(/[^\w-]+/g, "-");
  let anchorsDone = false;
  for (const width of WIDTHS) {
    const problems = [];
    const info = [];
    let page;
    try {
      page = await openPage(width, path, problems);
    } catch (e) {
      console.log(`[${width}] ${path}: cannot load (${e.message.split("\n")[0]})`);
      total++;
      continue;
    }

    // Scroll through the page so lazy images and whileInView animations run.
    await page.evaluate(async () => {
      const step = Math.max(400, Math.floor(window.innerHeight * 0.8));
      for (let y = 0; y < document.documentElement.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(600);
    await page.evaluate(LABEL);

    const r = await page.evaluate(() => {
      const vw = document.documentElement.clientWidth;
      const overflowX = document.documentElement.scrollWidth > vw + 1;
      const offenders = [];
      if (overflowX) {
        for (const el of document.querySelectorAll("body *")) {
          const b = el.getBoundingClientRect();
          if (b.width > 0 && b.height > 0 && (b.right > vw + 1 || b.left < -1)) {
            if (offenders.some((o) => o.contains(el))) continue;
            offenders.push(el);
            if (offenders.length >= 5) break;
          }
        }
      }
      const imgs = [...document.images];
      const broken = imgs.filter((i) => i.complete && i.naturalWidth === 0).map((i) => (i.currentSrc || i.src).slice(0, 100));
      const noAlt = imgs.filter((i) => !i.hasAttribute("alt")).length;
      const h1 = document.querySelectorAll("h1").length;
      const hiddenBlocks = [...document.querySelectorAll("section, section > *")]
        .filter((el) => el.getBoundingClientRect().height > 40 && Number(getComputedStyle(el).opacity) < 0.05)
        .slice(0, 3).map(window.__label);
      const anchors = [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute("href"));
      const deadAnchors = [...new Set(anchors.filter((h) => h.length > 1 && !document.getElementById(decodeURIComponent(h.slice(1)))))];
      const placeholders = anchors.filter((h) => h === "#").length;
      return { overflowX, offenders: offenders.map(window.__label), broken, noAlt, h1, hiddenBlocks, deadAnchors, placeholders };
    });

    if (r.overflowX) problems.push(`horizontal overflow; wider than viewport: ${r.offenders.join(" | ") || "unknown element"}`);
    if (r.broken.length) problems.push(`broken images: ${r.broken.join(", ")}`);
    if (r.noAlt) problems.push(`${r.noAlt} <img> without alt attribute`);
    if (r.h1 !== 1) problems.push(`${r.h1} <h1> elements (expected 1)`);
    if (r.hiddenBlocks.length) problems.push(`invisible after scroll (opacity 0, stuck animation?): ${r.hiddenBlocks.join(" | ")}`);
    if (!anchorsDone) {
      if (r.deadAnchors.length) problems.push(`anchor links to missing ids: ${r.deadAnchors.join(", ")}`);
      if (r.placeholders) info.push(`${r.placeholders} link(s) with href="#" (placeholders — real URLs before launch)`);
      anchorsDone = true;
    }

    const file = join(OUT, `${slug}-${width}.png`);
    await page.screenshot({ path: file, fullPage: true });

    if (width === MENU_WIDTH) {
      try { problems.push(...(await checkMenu(page))); } catch (e) { problems.push(`mobile menu: check failed (${e.message.split("\n")[0]})`); }
    }
    if (width === KEYBOARD_WIDTH) {
      try {
        const k = await checkKeyboard(page);
        problems.push(...k.issues);
        info.push(`keyboard: ${k.stops} Tab stops`);
      } catch (e) { problems.push(`keyboard: check failed (${e.message.split("\n")[0]})`); }
    }
    await page.close();

    const unique = [...new Set(problems)];
    for (const u of unique) (hits[`${path} ${u}`] ??= []).push(width);
    console.log(`[${width}] ${path}: ${unique.length ? `${unique.length} issue(s)` : "OK"} → ${file}`);
    for (const i of info) console.log(`   · ${i}`);
  }
}

await browser.close();
const list = Object.entries(hits);
if (list.length) {
  console.log("Issues:");
  for (const [issue, ws] of list.slice(0, 20)) console.log(`   - [${ws.join(",")}] ${issue}`);
  if (list.length > 20) console.log(`   … and ${list.length - 20} more`);
}
total += list.length;
console.log(total ? `RESULT: ${total} issue(s)` : "RESULT: OK");
process.exit(total ? 1 : 0);
