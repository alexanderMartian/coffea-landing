"use client";

import { useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function TestimonialsCarousel({
  pages,
  className,
}: {
  pages: ReactNode[];
  className?: string;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  // Active dot follows native scrolling (swipe, trackpad, Shift + wheel, keyboard)
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const index = pageRefs.current.indexOf(entry.target as HTMLDivElement);
          if (index !== -1) setActive(index);
        }
      },
      { root: track, threshold: 0.6 }
    );
    pageRefs.current.forEach((page) => page && observer.observe(page));
    return () => observer.disconnect();
  }, [pages.length]);

  function goTo(index: number) {
    const track = trackRef.current;
    if (!track) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    track.scrollTo({
      left: index * track.clientWidth,
      behavior: reduce ? "auto" : "smooth",
    });
  }

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      className={className}
    >
      <div
        ref={trackRef}
        tabIndex={0}
        className="flex overflow-x-auto snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
      >
        {pages.map((page, i) => (
          <div
            key={i}
            ref={(el) => {
              pageRefs.current[i] = el;
            }}
            role="group"
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${pages.length}`}
            className="w-full shrink-0 snap-start"
          >
            {page}
          </div>
        ))}
      </div>

      <div data-spec="testimonials-dots" className="flex w-fit mx-auto mt-6">
        {pages.map((_, i) => (
          <button
            key={i}
            type="button"
            aria-label={`Show reviews ${i * 3 + 1}–${i * 3 + 3}`}
            aria-current={i === active ? "true" : undefined}
            onClick={() => goTo(i)}
            className="group p-4 -my-4 lg:p-1.5 lg:-my-1.5 lg:-mx-0.5 lg:first:-ml-1.5 lg:last:-mr-1.5 rounded-full transition-colors hover:bg-foreground/10 focus-visible:outline-2 focus-visible:outline-offset-0 focus-visible:outline-foreground"
          >
            <span
              className={cn(
                "block w-3 h-3 rounded-full transition-colors",
                i === active
                  ? "bg-foreground"
                  : "bg-foreground/50 group-hover:bg-foreground/75"
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
}
