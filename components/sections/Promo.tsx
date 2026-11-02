import Image from "next/image";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import { site } from "@/content/site";

export default function Promo({ className }: { className?: string }) {
  return (
    <section
      id="promo"
      data-spec="promo"
      className={cn("relative overflow-hidden bg-warm-surface", className)}
    >
      {/* Left decorative image — hidden on mobile */}
      <div
        data-spec="promo-img-left"
        className="absolute inset-y-0 left-0 w-[27.08%] 3xl:w-[520px] hidden md:block"
      >
        <Image
          src="/images/promo/promo-left.png"
          alt=""
          fill
          className="object-cover mix-blend-multiply"
          sizes="27vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[240px] md:min-h-[335px]">
        <Reveal className="w-full px-6 py-10 md:py-0 text-center md:text-left md:pl-[31.67%] 3xl:pl-[608px] md:pr-6">
          <h2
            data-spec="promo-heading"
            className="font-display font-semibold text-2xl leading-tight md:text-[2rem] 3xl:text-[2.5rem] 3xl:leading-[1.25] text-black max-w-xs md:max-w-[372px] mx-auto md:mx-0"
          >
            {site.promo.heading}
          </h2>
          <a
            href={site.promo.ctaHref}
            data-spec="promo-cta"
            className="mt-6 inline-flex items-center gap-1 bg-primary text-background font-sans font-medium text-base leading-[1.2] rounded-[6.25rem] py-4 px-9 hover:bg-primary/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
          >
            {site.promo.cta}
            <span className="flex items-center">
              <ChevronRight className="h-5 w-5" strokeWidth={2} />
              <ChevronRight className="h-5 w-5 -ml-3" strokeWidth={2} />
            </span>
          </a>
        </Reveal>
      </div>

      {/* Right decorative image — hidden on mobile */}
      <div
        data-spec="promo-img-right"
        className="absolute inset-y-0 right-0 w-[26.2%] 3xl:w-[503px] hidden md:block"
      >
        <Image
          src="/images/promo/promo-right.png"
          alt=""
          fill
          className="object-cover mix-blend-multiply"
          sizes="26vw"
        />
      </div>
    </section>
  );
}
