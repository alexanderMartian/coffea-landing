import type { Metadata } from "next";
import Link from "next/link";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: site.notFound.heading,
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center px-4 py-32 text-center md:px-8">
      <h1 className="font-display font-bold text-display text-foreground">{site.notFound.heading}</h1>
      <p className="mt-4 max-w-[34rem] font-sans text-base text-warm-text">{site.notFound.text}</p>
      <Link
        href={site.notFound.ctaHref}
        className="mt-8 inline-flex min-h-11 items-center rounded-[6.25rem] bg-primary px-9 py-4 font-sans text-base font-medium leading-[1.2] text-background transition-colors hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        {site.notFound.cta}
      </Link>
    </main>
  );
}
