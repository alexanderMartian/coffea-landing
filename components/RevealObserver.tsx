"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

// One IntersectionObserver for every [data-reveal] element on the page. Sections stay Server Components:
// they only add the attribute. Elements already on screen at load are left alone (no animation, no LCP delay).
export default function RevealObserver() {
  const pathname = usePathname(); // re-scan after client-side navigation
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-reveal", "shown");
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.1 },
    );
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      if (el.dataset.reveal === "shown") continue;
      if (el.getBoundingClientRect().top < window.innerHeight) continue; // on screen now — never hide it
      el.setAttribute("data-reveal", "pending");
      io.observe(el);
    }
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
