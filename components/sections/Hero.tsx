import Image from "next/image";
import { site } from "@/content/site";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative overflow-x-clip min-h-[70svh] 3xl:min-h-[62.5rem] flex flex-col"
    >
      {/* Full-bleed background image */}
      <Image
        src="/images/hero/hero-bg.jpg"
        alt={site.hero.imageAlt}
        fill
        loading="eager"
        fetchPriority="high"
        className="object-cover"
        sizes="100vw"
      />
      {/* Readability gradient — mobile/tablet only, hidden at desktop */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent lg:hidden"
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative mx-auto w-full max-w-content px-4 md:px-8 lg:px-12 3xl:px-0 flex-1 flex flex-col justify-center 3xl:justify-start 3xl:pt-[18.375rem]">
        <div
          data-spec="hero-content"
          className="flex flex-col gap-8 3xl:gap-14 w-full max-w-[34.8125rem]"
        >
          {/* Eyebrow + heading */}
          <div className="flex flex-col gap-6 3xl:gap-14">
            <div className="flex flex-col gap-4 3xl:gap-10">
              <p
                data-spec="hero-eyebrow"
                className="font-sans font-medium text-base 3xl:text-xl text-white tracking-[0.2em] uppercase"
              >
                {site.hero.eyebrow}
              </p>
              <h1
                data-spec="hero-title"
                className="font-display font-bold text-display text-white w-full max-w-[34.8125rem]"
              >
                {site.hero.title}
              </h1>
            </div>
            <p
              data-spec="hero-body"
              className="font-sans font-normal text-base lg:text-lg text-white leading-[1.444] max-w-[26.9375rem]"
            >
              {site.hero.body}
            </p>
          </div>

          {/* CTA */}
          <a
            href={site.hero.ctaHref}
            data-spec="hero-cta"
            className="inline-flex items-center justify-center bg-white text-foreground font-sans font-medium text-base lg:text-lg rounded-[6.25rem] px-10 min-h-[3.4375rem] w-fit hover:bg-white/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {site.hero.cta}
          </a>
        </div>
      </div>
    </section>
  );
}
