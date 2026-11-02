import Image from "next/image";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export default function Newsletter({ className }: { className?: string }) {
  return (
    <section
      id="newsletter"
      data-spec="newsletter"
      className={cn(
        "relative overflow-x-clip bg-warm-surface flex flex-col items-center py-10 md:py-14 3xl:pt-[5.375rem] 3xl:pb-0 3xl:min-h-[320px]",
        className,
      )}
    >
      {/* Left decorative image — hidden on mobile */}
      <div
        data-spec="newsletter-img-left"
        className="absolute inset-y-0 left-0 w-1/4 3xl:w-[482px] hidden md:block"
      >
        <Image
          src="/images/newsletter/coffee-decor.jpg"
          alt=""
          fill
          className="object-cover mix-blend-multiply"
          sizes="(min-width: 1920px) 482px, 25vw"
        />
      </div>

      {/* Right decorative image — same image, mirrored */}
      <div
        data-spec="newsletter-img-right"
        className="absolute inset-y-0 right-0 w-1/4 3xl:w-[482px] hidden md:block"
      >
        <Image
          src="/images/newsletter/coffee-decor.jpg"
          alt=""
          fill
          className="object-cover scale-x-[-1] mix-blend-multiply"
          sizes="(min-width: 1920px) 482px, 25vw"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-4 3xl:px-0 w-full max-w-lg 3xl:max-w-[514px]">
        <h2
          data-spec="newsletter-title"
          className="font-alt font-semibold text-xl leading-[1.5] md:text-2xl 3xl:text-[2rem] text-foreground"
        >
          {site.newsletter.heading}
        </h2>
        <p
          data-spec="newsletter-subtitle"
          className="mt-2 font-alt font-medium text-sm 3xl:text-base text-foreground"
        >
          {site.newsletter.subheading}
        </p>

        <form className="mt-6 w-full flex flex-col md:flex-row gap-3">
          <label htmlFor="newsletter-email" className="sr-only">
            {site.newsletter.inputPlaceholder}
          </label>
          {/* Input pill — data-spec on the pill wrapper to match Figma Frame 20 */}
          <div
            data-spec="newsletter-input"
            className="relative flex items-center w-full min-h-[44px] md:flex-1 3xl:flex-none 3xl:w-[364px] 3xl:h-[44px] rounded-[100px] bg-background pl-6 pr-4 3xl:py-[10px] 3xl:pr-[190px] focus-within:ring-2 focus-within:ring-foreground/60 transition-shadow"
          >
            <Mail
              className="shrink-0 mr-[10px] text-foreground pointer-events-none"
              size={24}
              strokeWidth={2}
            />
            <input
              id="newsletter-email"
              type="email"
              name="email"
              placeholder={site.newsletter.inputPlaceholder}
              className="flex-1 min-w-0 min-h-[44px] 3xl:min-h-0 bg-transparent font-alt font-semibold text-base text-foreground placeholder:text-foreground focus:outline-none"
            />
          </div>
          <button
            type="submit"
            data-spec="newsletter-btn"
            className="w-full md:w-auto min-h-[44px] 3xl:w-[138px] 3xl:h-[44px] rounded-[100px] bg-foreground text-background font-alt font-semibold text-base px-7 hover:bg-foreground/90 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
          >
            {site.newsletter.cta}
          </button>
        </form>
      </div>
    </section>
  );
}
