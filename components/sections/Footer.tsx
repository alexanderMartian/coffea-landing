import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { site } from "@/content/site";

export default function Footer({ className }: { className?: string }) {
  return (
    <footer
      id="footer"
      className={cn("bg-foreground", className)}
    >
      <div className="mx-auto w-full max-w-content px-4 md:px-8 3xl:px-0 py-10 lg:py-16 3xl:pt-[80px] 3xl:pb-[95px]">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 3xl:gap-0 3xl:items-start">

          {/* Logo */}
          <div className="3xl:w-[221px] 3xl:shrink-0">
            <Link
              href="/"
              aria-label="Coffea — home"
              data-spec="footer-logo"
              className="font-display font-bold text-white [font-variant-caps:small-caps] text-[1.75rem] 3xl:text-[2.4rem] leading-[1.2] inline-flex items-center min-h-11 lg:min-h-0 hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              {site.footer.logo}
            </Link>
          </div>

          {/* Nav columns */}
          <nav aria-label="Footer" className="flex-1 3xl:pt-[16px]">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 3xl:grid-cols-[239px_230px_247px_auto] 3xl:gap-0">
              {site.footer.columns.map((col, i) => {
                const specKeys = [
                  "footer-privacy-heading",
                  "footer-services-heading",
                  "footer-about-heading",
                  "footer-information-heading",
                ] as const;
                return (
                <div key={col.heading}>
                  <h3
                    data-spec={specKeys[i]}
                    className="font-display font-medium text-base 3xl:text-2xl text-white uppercase leading-[1.333]"
                  >
                    {col.heading}
                  </h3>
                  <ul className="mt-4 3xl:mt-6 flex flex-col gap-3 3xl:gap-[15px]">
                    {col.links.map((link, j) => (
                      <li key={link.label}>
                        {/* TODO: replace / with real URLs */}
                        <a
                          href={link.href}
                          data-spec={i === 0 && j === 0 ? "footer-privacy-link" : undefined}
                          className="font-alt text-sm 3xl:text-lg text-white inline-flex items-center min-h-11 min-w-[44px] lg:min-h-0 lg:min-w-0 leading-[1.5] hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                        >
                          {link.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                );
              })}
            </div>
          </nav>

          {/* Social Media */}
          <div className="3xl:w-[175px] 3xl:shrink-0 3xl:pt-[18px]">
            <h3
              data-spec="footer-social-heading"
              className="font-display font-bold text-base 3xl:text-2xl text-white uppercase leading-[1.333] whitespace-nowrap"
            >
              {site.footer.social.heading}
            </h3>
            <div className="mt-4 3xl:mt-[35px] flex gap-3 3xl:gap-[12px] 3xl:justify-center">
              {site.footer.social.links.map((s, i) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="inline-flex items-center justify-center w-11 h-11 lg:w-auto lg:h-auto hover:opacity-80 transition-opacity focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white rounded-sm"
                >
                  <Image
                    data-spec={i === 0 ? "footer-social-icon" : undefined}
                    src={s.icon}
                    alt=""
                    width={24}
                    height={24}
                  />
                </a>
              ))}
            </div>
          </div>

        </div>

        <p className="mt-8 font-alt text-sm text-white/70 md:text-right">
          <a
            href={site.footer.credit.href}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap underline underline-offset-2 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {site.footer.credit.text}
          </a>
          {" · "}
          <a
            href={site.footer.credit.licenseHref}
            target="_blank"
            rel="noopener noreferrer"
            className="whitespace-nowrap underline underline-offset-2 hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            {site.footer.credit.license}
          </a>
        </p>
      </div>
    </footer>
  );
}
