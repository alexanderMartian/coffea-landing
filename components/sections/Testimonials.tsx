import Image from "next/image";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import { site } from "@/content/site";
import TestimonialsCarousel from "./TestimonialsCarousel";

function StarRating({ rating }: { rating: number }) {
  return (
    <div
      role="img"
      aria-label={`${rating} out of 5 stars`}
      className="flex shrink-0 gap-1"
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          aria-hidden="true"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          className={i < rating ? "fill-[#ffb921]" : "fill-[#cecece]"}
        >
          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
        </svg>
      ))}
    </div>
  );
}

type TestimonialItem = (typeof site.testimonials.items)[number];

// Desktop visual order: active (DOM 0) → center (order-2); card1 (DOM 1) → left (order-1); card2 (DOM 2) → right (order-3)
const CARDS_PER_PAGE = 3;

const DESKTOP_ORDER_CLASS = ["lg:order-2", "lg:order-1", "lg:order-3"] as const;

function TestimonialCard({
  item,
  domIndex,
  active,
  spec,
}: {
  item: TestimonialItem;
  domIndex: number;
  active?: boolean;
  spec?: boolean;
}) {
  return (
    <div
      data-spec={spec ? "testimonials-card-active" : undefined}
      className={cn(
        "rounded-[18px] overflow-hidden bg-warm-surface/40",
        // Mobile/tablet: full-width stacked card
        "w-full",
        // Desktop: flex-row child; widths and padding from design
        // Active: 441px, p-7 (28px all sides) → text width 385px (clipsContent=false, no clipping)
        // Side:   417px, asymmetric padding (pl=28, pr=19, pt=28, pb=17) → text width 370px
        active
          ? "p-7 lg:w-[30.54%] 3xl:w-[441px] lg:border-2 lg:border-foreground/10 lg:min-h-[235px]"
          : "pt-7 pl-7 pr-[19px] pb-[17px] lg:w-[28.87%] 3xl:w-[417px]",
        // Reorder at desktop so featured card is in center column
        DESKTOP_ORDER_CLASS[domIndex]
      )}
    >
      {/* Top row: avatar + name/role on the left, stars top-aligned on the right */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div
            data-spec={spec ? "testimonials-card-avatar" : undefined}
            className="relative shrink-0 w-14 h-14 rounded-full overflow-hidden"
          >
            <Image
              src={item.avatar}
              alt={item.avatarAlt}
              width={56}
              height={56}
              className="object-cover"
            />
          </div>
          <div className="min-w-0">
            <p
              data-spec={spec ? "testimonials-card-name" : undefined}
              className="font-alt font-semibold text-[18px] leading-[27px] text-foreground"
            >
              {item.name}
            </p>
            <p
              data-spec={spec ? "testimonials-card-role" : undefined}
              className="font-alt font-semibold text-[14px] leading-[21px] text-foreground/70"
            >
              {item.role}
            </p>
          </div>
        </div>
        <StarRating rating={item.rating} />
      </div>

      {/* Review body */}
      <p
        data-spec={spec ? "testimonials-card-body" : undefined}
        data-allow-small=""
        className="mt-[18px] font-alt font-medium text-[12px] leading-[20px] text-foreground [text-box:trim-both_cap_alphabetic]"
      >
        {item.body}
      </p>
    </div>
  );
}

export default function Testimonials({ className }: { className?: string }) {
  const { testimonials } = site;

  // Pages of 3: the first item of each page is the featured (centre) card
  const pages = Array.from(
    { length: Math.ceil(testimonials.items.length / CARDS_PER_PAGE) },
    (_, p) => (
      <div
        key={p}
        className="flex flex-col gap-4 lg:flex-row lg:gap-0 lg:items-center lg:justify-between"
      >
        {testimonials.items
          .slice(p * CARDS_PER_PAGE, (p + 1) * CARDS_PER_PAGE)
          .map((item, i) => (
            <TestimonialCard
              key={i}
              item={item}
              domIndex={i}
              active={i === 0}
              spec={p === 0 && i === 0}
            />
          ))}
      </div>
    )
  );

  return (
    <section id="testimonials" className={cn("overflow-x-clip", className)}>
      <div className="mx-auto w-full max-w-content px-4 md:px-8 lg:px-12 3xl:px-0">

        {/* Heading: "Come and Join" + "our happy customers" */}
        <Reveal className="flex flex-col items-center">
          <p
            data-spec="testimonials-heading-label"
            className="w-fit font-reggae text-h3 leading-[1.44] text-foreground"
          >
            {testimonials.eyebrow}
          </p>
          <h2
            data-spec="testimonials-heading-title"
            className="w-fit font-display font-semibold text-h3 leading-[1.344] tracking-[0.04em] uppercase text-foreground mt-3"
          >
            {testimonials.heading}
          </h2>
          <p className="mt-2 text-center text-sm text-foreground/70">
            {testimonials.sampleNote}
          </p>
        </Reveal>

        {/* Carousel is revealed once as a whole; pages 2–3 sit off-screen sideways */}
        <Reveal className="mt-8">
          <TestimonialsCarousel pages={pages} />
        </Reveal>
      </div>
    </section>
  );
}
