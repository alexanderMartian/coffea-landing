"use client";

import { useRef } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";

export default function CarouselRow({ children }: { children: React.ReactNode }) {
  const rowRef = useRef<HTMLDivElement>(null);

  function scroll(dir: 1 | -1) {
    const row = rowRef.current;
    if (!row) return;
    const card = row.firstElementChild as HTMLElement | null;
    // gap-1 = 4 px
    row.scrollBy({ left: dir * ((card?.offsetWidth ?? 300) + 4), behavior: "smooth" });
  }

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous item"
        onClick={() => scroll(-1)}
        className="hidden lg:flex absolute left-0 top-1/2 -translate-y-1/2 z-10
                   size-[4.4375rem] rounded-full bg-warm-surface
                   items-center justify-center text-foreground
                   hover:bg-warm-surface/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <ArrowLeft size={34} aria-hidden />
      </button>

      <div
        ref={rowRef}
        className="flex overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory
                   gap-1 lg:mx-[4.5rem] 3xl:mx-[8.875rem]"
      >
        {children}
      </div>

      <button
        type="button"
        aria-label="Next item"
        onClick={() => scroll(1)}
        className="hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 z-10
                   size-[4.4375rem] rounded-full bg-warm-surface
                   items-center justify-center text-foreground
                   hover:bg-warm-surface/80 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      >
        <ArrowRight size={34} aria-hidden />
      </button>
    </div>
  );
}
