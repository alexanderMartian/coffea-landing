#!/usr/bin/env node
// Checks ONE landing section against its Figma reference and responsive rules (used by the figma-import skill).
//
// Usage:
//   node scripts/section-check.mjs <section-id> [--widths 360,768,1920] [--base http://localhost:3000] [--path /]
//
// Inputs (optional, created by the figma-import skill):
//   design/<section-id>.png        Figma export of the section frame (scale 1)
//   design/<section-id>.spec.json  key values from Figma: { frame: { width, height }, elements: { "<data-spec key>": {...} } }
//
// At the design width (spec.frame.width, default 1920) it measures every [data-spec] element against the spec
// and makes a pixel diff with design/<id>.png. At every width it runs layout rules (overflow, small text,
// tap targets, overlaps, clipped text, upscaled images, invisible blocks).
// Output: a short text report + screenshots in .qa/sections/. Exit code 1 when anything is off.
import { mkdirSync, readFileSync, existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DEFAULT_WIDTHS = [360, 768, 1024, 1280, 1440, 1920, 2560];
const OUT = join(".qa", "sections");

// ---------- args ----------
const argv = process.argv.slice(2);
const flag = (name) => {
  const i = argv.indexOf(`--${name}`);
  return i === -1 ? undefined : argv[i + 1];
};
const id = argv.find((a, i) => !a.startsWith("--") && !argv[i - 1]?.startsWith("--"));
if (!id) {
  console.log("Usage: node scripts/section-check.mjs <section-id> [--widths 360,1920] [--base http://localhost:3000] [--path /]");
  process.exit(2);
}
const base = flag("base") ?? "http://localhost:3000";
const url = new URL(flag("path") ?? "/", base).toString();

const specPath = join("design", `${id}.spec.json`);
const designPngPath = join("design", `${id}.png`);
let spec = null;
if (existsSync(specPath)) {
  try {
    spec = JSON.parse(readFileSync(specPath, "utf8"));
  } catch (e) {
    console.log(`SPEC INVALID: ${specPath} — ${e.message}`);
    process.exit(2);
  }
}
const designWidth = Number(spec?.frame?.width) || 1920;
const widths = (flag("widths") ? flag("widths").split(",").map(Number) : DEFAULT_WIDTHS)
  .filter((w) => Number.isFinite(w) && w > 0)
  .sort((a, b) => a - b);

// ---------- server + playwright ----------
try {
  const res = await fetch(url, { signal: AbortSignal.timeout(5000) });
  if (res.status >= 500) throw new Error();
} catch {
  console.log(`SERVER DOWN: ${url} is not reachable — run \`pnpm dev\``);
  process.exit(2);
}

let chromium;
try {
  ({ chromium } = await import("playwright"));
} catch {
  console.log("Playwright not installed: run `pnpm add -D playwright` and `pnpm exec playwright install chromium`");
  process.exit(2);
}

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});

// Hide the Next.js dev indicator and freeze CSS motion so screenshots are stable.
const FREEZE_CSS = `
  nextjs-portal, [data-nextjs-toast], [data-next-badge-root] { display: none !important; }
  *, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; }
`;

// ---------- in-page helpers (plain JS, run inside the browser) ----------
const PAGE_HELPERS = () => {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 1;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  // Any CSS color (rgb, oklch, color(...)) -> "#rrggbb" or "transparent".
  window.__toHex = (css) => {
    if (!css || css === "transparent") return "transparent";
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = "#000";
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    if (a === 0) return "transparent";
    return "#" + [r, g, b].map((v) => v.toString(16).padStart(2, "0")).join("");
  };
  window.__visible = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return false;
    const s = getComputedStyle(el);
    return s.visibility !== "hidden" && s.display !== "none" && Number(s.opacity) > 0.05;
  };
  window.__label = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.dataset.spec) s += `[${el.dataset.spec}]`;
    else if (el.id) s += `#${el.id}`;
    else if (typeof el.className === "string" && el.className.trim()) s += "." + el.className.trim().split(/\s+/).slice(0, 2).join(".");
    const t = (el.textContent || "").trim().replace(/\s+/g, " ").slice(0, 24);
    return t ? `${s} "${t}"` : s;
  };
  window.__textLeaves = (root) =>
    [...root.querySelectorAll("*")].filter(
      (el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim()) && window.__visible(el)
    );
};

async function preparePage(width) {
  const context = await browser.newContext({ viewport: { width, height: 1000 }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
  await page.addStyleTag({ content: FREEZE_CSS });
  await page.evaluate(PAGE_HELPERS);
  await page.evaluate(() => document.fonts.ready);
  const exists = await page.evaluate((sid) => !!document.getElementById(sid), id);
  if (!exists) return { context, page, section: null };
  // Scroll through the section so lazy images load, then back to top.
  await page.evaluate(async (sid) => {
    const el = document.getElementById(sid);
    const top = el.getBoundingClientRect().top + window.scrollY;
    const bottom = top + el.offsetHeight;
    for (let y = Math.max(0, top - 200); y < bottom; y += 500) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 80));
    }
    const imgs = [...el.querySelectorAll("img")];
    await Promise.race([
      Promise.all(imgs.map((i) => (i.complete ? null : new Promise((r) => { i.onload = i.onerror = r; })))),
      new Promise((r) => setTimeout(r, 5000)),
    ]);
    window.scrollTo(0, 0);
  }, id);
  await page.waitForTimeout(250);
  return { context, page, section: page.locator(`#${id}`) };
}

// ---------- spec measurement ----------
async function measure(page, keys) {
  return page.evaluate(
    ({ sid, keys }) => {
      const section = document.getElementById(sid);
      const sr = section.getBoundingClientRect();
      const px = (v) => (v === "normal" ? "normal" : Math.round(parseFloat(v) * 100) / 100);
      const out = {};
      for (const key of keys) {
        const el = key === sid ? section : section.querySelector(`[data-spec="${key}"]`);
        if (!el) { out[key] = null; continue; }
        const r = el.getBoundingClientRect();
        const s = getComputedStyle(el);
        const row = s.display.includes("flex") && !s.flexDirection.startsWith("column");
        out[key] = {
          x: Math.round(r.left - sr.left), y: Math.round(r.top - sr.top), w: Math.round(r.width), h: Math.round(r.height),
          fontSize: px(s.fontSize), lineHeight: px(s.lineHeight), fontWeight: Number(s.fontWeight),
          letterSpacing: s.letterSpacing === "normal" ? 0 : px(s.letterSpacing), fontFamily: s.fontFamily,
          color: window.__toHex(s.color), bg: window.__toHex(s.backgroundColor),
          radius: px(s.borderTopLeftRadius),
          paddingTop: px(s.paddingTop), paddingRight: px(s.paddingRight), paddingBottom: px(s.paddingBottom), paddingLeft: px(s.paddingLeft),
          gap: px(row ? s.columnGap : s.rowGap), rowGap: px(s.rowGap), columnGap: px(s.columnGap),
        };
      }
      return out;
    },
    { sid: id, keys }
  );
}

const TOL = { x: 2, y: 2, w: 2, h: 2, fontSize: 0.5, lineHeight: 1, letterSpacing: 0.3, radius: 1, gap: 2, rowGap: 2, columnGap: 2, paddingTop: 2, paddingRight: 2, paddingBottom: 2, paddingLeft: 2 };
const hexDist = (a, b) => {
  if (a === b) return 0;
  if (a === "transparent" || b === "transparent" || !/^#[0-9a-f]{6}$/i.test(a) || !/^#[0-9a-f]{6}$/i.test(b)) return 999;
  const p = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
  const [x, y] = [p(a), p(b)];
  return Math.max(...x.map((v, i) => Math.abs(v - y[i])));
};

function compareSpec(specEls, measured) {
  const fails = [];
  let checks = 0;
  for (const [key, want] of Object.entries(specEls)) {
    const got = measured[key];
    if (!got) { fails.push(`${key}: element with data-spec="${key}" not found`); continue; }
    for (const [prop, exp] of Object.entries(want)) {
      if (exp === null || exp === undefined || prop.startsWith("_")) continue;
      checks++;
      const act = got[prop];
      let ok;
      if (prop === "color" || prop === "bg") ok = hexDist(String(exp).toLowerCase(), act) <= 3;
      else if (prop === "fontFamily") ok = String(act).toLowerCase().includes(String(exp).toLowerCase());
      else if (prop === "fontWeight") ok = Number(exp) === act;
      else if (prop in TOL) ok = typeof act === "number" && Math.abs(act - Number(exp)) <= TOL[prop];
      else { checks--; continue; } // unknown prop: ignore
      if (!ok) fails.push(`${key} ${prop}: ours ${act} ≠ design ${exp}`);
    }
  }
  return { checks, fails };
}

// ---------- pixel diff (in a blank page, no extra deps) ----------
async function pixelDiff(oursB64, designB64) {
  const page = await browser.newPage();
  const res = await page.evaluate(
    async ({ oursB64, designB64 }) => {
      const load = (b64) => new Promise((ok, err) => { const i = new Image(); i.onload = () => ok(i); i.onerror = err; i.src = "data:image/png;base64," + b64; });
      const [ours, design] = await Promise.all([load(oursB64), load(designB64)]);
      const W = ours.naturalWidth;
      const dScale = W / design.naturalWidth;
      const dH = Math.round(design.naturalHeight * dScale);
      const H = Math.max(ours.naturalHeight, dH);
      const mk = () => { const c = document.createElement("canvas"); c.width = W; c.height = H; const x = c.getContext("2d", { willReadFrequently: true }); x.fillStyle = "#fff"; x.fillRect(0, 0, W, H); return [c, x]; };
      const [, a] = mk(); a.drawImage(ours, 0, 0);
      const [, b] = mk(); b.drawImage(design, 0, 0, W, dH);
      const A = a.getImageData(0, 0, W, H).data, B = b.getImageData(0, 0, W, H).data;
      const [outC, o] = mk();
      const img = o.createImageData(W, H), D = img.data;
      const BAND = 40, bands = new Array(Math.ceil(H / BAND)).fill(0);
      let diff = 0;
      for (let p = 0; p < A.length; p += 4) {
        const d = Math.max(Math.abs(A[p] - B[p]), Math.abs(A[p + 1] - B[p + 1]), Math.abs(A[p + 2] - B[p + 2]));
        const g = (B[p] * 0.3 + B[p + 1] * 0.59 + B[p + 2] * 0.11) * 0.35 + 165; // faded design as background
        if (d > 40) { diff++; bands[Math.floor(p / 4 / W / BAND)]++; D[p] = 230; D[p + 1] = 30; D[p + 2] = 30; }
        else { D[p] = D[p + 1] = D[p + 2] = g; }
        D[p + 3] = 255;
      }
      o.putImageData(img, 0, 0);
      const top = bands
        .map((n, i) => ({ from: i * BAND, to: Math.min(H, (i + 1) * BAND), pct: (n / (W * BAND)) * 100 }))
        .filter((x) => x.pct >= 5)
        .sort((x, y) => y.pct - x.pct)
        .slice(0, 3);
      return { pct: (diff / (W * H)) * 100, oursH: ours.naturalHeight, designH: dH, top, png: outC.toDataURL("image/png").split(",")[1] };
    },
    { oursB64, designB64 }
  );
  await page.close();
  return res;
}

// ---------- layout rules ----------
async function rules(page, width) {
  return page.evaluate(
    ({ sid, width }) => {
      const section = document.getElementById(sid);
      const vw = document.documentElement.clientWidth;
      const issues = [];
      const all = [...section.querySelectorAll("*")].filter(window.__visible);

      // 1. horizontal overflow of the page caused by this section
      if (document.documentElement.scrollWidth > vw + 1) {
        const off = all.filter((el) => { const r = el.getBoundingClientRect(); return r.right > vw + 1 || r.left < -1; });
        const top = off.filter((el) => !off.some((o) => o !== el && o.contains(el))).slice(0, 3);
        if (top.length) issues.push(`overflow-x: ${top.map((el) => `${window.__label(el)} (right ${Math.round(el.getBoundingClientRect().right)})`).join(" | ")}`);
      }
      const texts = window.__textLeaves(section);
      // 2. text cut by an overflow-hidden/clip ancestor or by ellipsis
      const clipped = texts.filter((el) => {
        const r = el.getBoundingClientRect();
        for (let p = el.parentElement; p && p !== document.body; p = p.parentElement) {
          const s = getComputedStyle(p);
          if (/(hidden|clip)/.test(s.overflowX + s.overflowY)) {
            const pr = p.getBoundingClientRect();
            if (r.right > pr.right + 1 || r.left < pr.left - 1 || r.bottom > pr.bottom + 1) return true;
          }
          if (p === section) break;
        }
        return el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).textOverflow === "ellipsis";
      });
      if (clipped.length) issues.push(`text cut off: ${clipped.slice(0, 3).map(window.__label).join(" | ")}`);
      // 3. small text
      const small = texts.filter((el) => parseFloat(getComputedStyle(el).fontSize) < 14 && !el.closest("[data-allow-small]"));
      if (small.length) issues.push(`text < 14px: ${small.slice(0, 3).map((el) => `${window.__label(el)} ${getComputedStyle(el).fontSize}`).join(" | ")}`);
      // 4. tap targets (touch widths only; inline links inside text are exempt)
      if (width < 1024) {
        const tap = all.filter((el) => el.matches("a[href], button, input:not([type=hidden]), select, textarea, [role=button], summary"))
          .filter((el) => getComputedStyle(el).display !== "inline")
          .filter((el) => { const r = el.getBoundingClientRect(); return r.width < 44 || r.height < 44; });
        if (tap.length) issues.push(`tap target < 44px: ${tap.slice(0, 3).map((el) => { const r = el.getBoundingClientRect(); return `${window.__label(el)} ${Math.round(r.width)}×${Math.round(r.height)}`; }).join(" | ")}`);
      }
      // 5. overlapping texts
      const pairs = [];
      const list = texts.filter((el) => !el.closest("[data-allow-overlap]")).slice(0, 200);
      for (let i = 0; i < list.length && pairs.length < 3; i++) {
        for (let j = i + 1; j < list.length && pairs.length < 3; j++) {
          const a = list[i], b = list[j];
          if (a.contains(b) || b.contains(a)) continue;
          const r1 = a.getBoundingClientRect(), r2 = b.getBoundingClientRect();
          const ix = Math.min(r1.right, r2.right) - Math.max(r1.left, r2.left);
          const iy = Math.min(r1.bottom, r2.bottom) - Math.max(r1.top, r2.top);
          if (ix > 2 && iy > 2 && ix * iy > 16) pairs.push(`${window.__label(a)} × ${window.__label(b)}`);
        }
      }
      if (pairs.length) issues.push(`overlapping text: ${pairs.join(" | ")}`);
      // 6. upscaled (blurry) images
      const up = [...section.querySelectorAll("img")].filter(window.__visible)
        .filter((i) => i.naturalWidth > 0 && i.getBoundingClientRect().width > i.naturalWidth * 1.05);
      if (up.length) issues.push(`image upscaled: ${up.slice(0, 2).map((i) => `${(i.currentSrc || i.src).split("/").pop().slice(0, 40)} ${i.naturalWidth}px→${Math.round(i.getBoundingClientRect().width)}px`).join(" | ")}`);
      // 7. invisible blocks (stuck enter animation)
      const ghost = [...section.querySelectorAll("*")].filter((el) => { const r = el.getBoundingClientRect(); return r.height > 40 && Number(getComputedStyle(el).opacity) < 0.05; });
      if (ghost.length) issues.push(`invisible (opacity 0): ${ghost.slice(0, 2).map(window.__label).join(" | ")}`);
      return issues;
    },
    { sid: id, width }
  );
}

// ---------- run ----------
let total = 0;
const atDesign = {}; // widths of spec elements at design width, for the "stretch" rule
const ruleHits = {}; // rule issue text -> widths where it occurred
console.log(`SECTION ${id} — ${url} — design width ${designWidth}${spec ? "" : " (no spec)"}`);

for (const width of widths) {
  const { context, page, section } = await preparePage(width);
  if (!section) {
    console.log(`[${width}] NOT FOUND: no element with id="${id}"`);
    total++;
    await context.close();
    continue;
  }
  const shot = join(OUT, `${id}-${width}.png`);
  const buf = await section.screenshot({ path: shot });
  const lines = [];

  if (width === designWidth) {
    if (spec?.elements) {
      const keys = Object.keys(spec.elements);
      const m = await measure(page, keys);
      for (const k of keys) if (m[k]) atDesign[k] = m[k].w;
      const { checks, fails } = compareSpec(spec.elements, m);
      lines.push(`spec ${checks - fails.length}/${checks} OK`);
      for (const f of fails.slice(0, 12)) lines.push(`   - ${f}`);
      if (fails.length > 12) lines.push(`   … and ${fails.length - 12} more`);
      total += fails.length;
    }
    if (existsSync(designPngPath)) {
      const d = await pixelDiff(buf.toString("base64"), readFileSync(designPngPath).toString("base64"));
      const diffPath = join(OUT, `${id}-diff.png`);
      writeFileSync(diffPath, Buffer.from(d.png, "base64"));
      const bands = d.top.map((b) => `${b.from}–${b.to}px ${b.pct.toFixed(0)}%`).join(", ");
      lines.push(`pixel diff ${d.pct.toFixed(1)}%${bands ? ` (worst rows: ${bands})` : ""} → ${diffPath}`);
      if (Math.abs(d.oursH - d.designH) > 4) { lines.push(`   - height: ours ${d.oursH} ≠ design ${d.designH}`); total++; }
    }
  } else if (width > designWidth && Object.keys(atDesign).length) {
    const m = await measure(page, Object.keys(atDesign));
    const stretched = Object.entries(atDesign)
      .filter(([k, w]) => k !== id && m[k] && m[k].w > w * 1.05)
      .map(([k, w]) => `${k} ${w}→${m[k].w}px`);
    if (stretched.length) lines.push(`   - content stretches beyond design: ${stretched.slice(0, 4).join(", ")}`);
    total += stretched.length ? 1 : 0;
  }

  const issues = await rules(page, width);
  for (const i of issues) (ruleHits[i] ??= []).push(width);

  const head = lines.length && !lines[0].startsWith("   ") ? lines.shift() : "";
  const bad = lines.some((l) => l.startsWith("   - ")) || issues.length;
  console.log(`[${width}] ${bad ? "ISSUES" : "OK"}${head ? ` · ${head}` : ""}${issues.length ? ` · ${issues.length} rule issue(s)` : ""} → ${shot}`);
  for (const l of lines) console.log(l);
  await context.close();
}

// Same rule issue at several widths is printed once with the list of widths.
const ruleList = Object.entries(ruleHits);
if (ruleList.length) {
  console.log("Layout rules:");
  for (const [issue, ws] of ruleList) console.log(`   - [${ws.join(",")}] ${issue}`);
  total += ruleList.length;
}

await browser.close();
console.log(total ? `RESULT: ${total} issue(s)` : "RESULT: OK");
process.exit(total ? 1 : 0);
