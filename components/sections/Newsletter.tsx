import Image from "next/image";
import { cn } from "@/lib/utils";
import Reveal from "@/components/Reveal";
import { site } from "@/content/site";
import NewsletterForm from "./NewsletterForm";

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
      <Reveal className="relative z-10 flex flex-col items-center text-center px-4 3xl:px-0 w-full max-w-lg 3xl:max-w-[514px]">
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

        <NewsletterForm
          placeholder={site.newsletter.inputPlaceholder}
          cta={site.newsletter.cta}
          submitting={site.newsletter.submitting}
          success={site.newsletter.success}
          errorGeneric={site.newsletter.errorGeneric}
        />
      </Reveal>
    </section>
  );
}
