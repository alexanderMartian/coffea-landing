import Link from "next/link";
import { Menu, Search } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { site } from "@/content/site";

export default function HeaderNav() {
  return (
    <div className="mx-auto w-full max-w-content px-4 md:px-8 3xl:px-0 flex items-center justify-between min-h-11 3xl:min-h-[3.8125rem]">
      {/* Logo */}
      <Link
        data-spec="header-logo"
        href="/"
        className="font-display font-bold text-[2rem] leading-none text-white shrink-0 min-h-11 flex items-center"
      >
        {site.name}
      </Link>

      {/* Desktop nav */}
      <nav aria-label="Main navigation" className="hidden lg:block">
        <ul data-spec="header-nav" className="flex items-center gap-10">
          {site.nav.links.map((link, i) => (
            <li key={link.label}>
              <a
                href={link.href}
                data-spec={i === 0 ? "header-nav-link" : undefined}
                className="font-sans font-medium text-lg text-white uppercase hover:text-white/80 transition-colors"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.nav.cta.href}
              className="font-sans font-semibold text-lg text-white uppercase hover:text-white/80 transition-colors"
            >
              {site.nav.cta.label}
            </a>
          </li>
        </ul>
      </nav>

      {/* Right side: search (desktop) + burger (mobile) */}
      <div className="flex items-center gap-3">
        {/* Search button — desktop only */}
        <button
          data-spec="header-search"
          aria-label="Search"
          className="hidden lg:flex items-center justify-center w-[3.8125rem] h-[3.8125rem] rounded-[6.25rem] bg-white text-foreground shrink-0 hover:bg-white/90 transition-colors"
        >
          <Search size={21} strokeWidth={2.5} />
        </button>

        {/* Mobile menu — Sheet */}
        <Sheet>
          <SheetTrigger asChild>
            <button
              aria-label="Open menu"
              className="lg:hidden flex items-center justify-center min-w-[2.75rem] min-h-[2.75rem] text-white"
            >
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full sm:max-w-full bg-foreground text-white border-none"
            showCloseButton={false}
          >
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <div className="flex flex-col h-full pt-16 px-8">
              <nav aria-label="Mobile navigation">
                <ul className="flex flex-col gap-8">
                  {site.nav.links.map((link) => (
                    <li key={link.label}>
                      <SheetClose asChild>
                        <a
                          href={link.href}
                          className="font-sans font-medium text-2xl text-white uppercase hover:text-white/80 transition-colors"
                        >
                          {link.label}
                        </a>
                      </SheetClose>
                    </li>
                  ))}
                  <li>
                    <SheetClose asChild>
                      <a
                        href={site.nav.cta.href}
                        className="font-sans font-semibold text-2xl text-white uppercase hover:text-white/80 transition-colors"
                      >
                        {site.nav.cta.label}
                      </a>
                    </SheetClose>
                  </li>
                </ul>
              </nav>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
}
