import type { Metadata, Viewport } from "next";
import { Playfair_Display, Outfit, Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import RevealObserver from "@/components/RevealObserver";
import { SITE_URL, IS_PRODUCTION } from "@/lib/site-url";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
  preload: false,
});

// Latin slice only: the Google CSS ships ~120 Japanese @font-face rules we never use.
// License: app/fonts/OFL.txt
const reggae = localFont({
  src: "./fonts/reggae-one-latin.woff2",
  variable: "--font-reggae-var",
  weight: "400",
  display: "swap",
  preload: false,
});

const TITLE = "Coffea — The richest coffee in the city";
const DESCRIPTION =
  "Coffea is a coffee shop serving rich coffee, cold brews and fresh desserts. Browse our menu, find your favorite cup and order online today.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: TITLE,
    template: "%s | Coffea",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  robots: IS_PRODUCTION ? { index: true, follow: true } : { index: false, follow: false },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Coffea",
    locale: "en_US",
    title: TITLE,
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#f1f0ee",
};

// Portfolio project: WebSite only, no invented business data.
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Coffea",
  url: SITE_URL,
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${outfit.variable} ${poppins.variable} ${reggae.variable} h-full antialiased motion-safe:scroll-smooth`}
      data-scroll-behavior="smooth"
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
          />
          <Header />
          {children}
          <Footer />
          <RevealObserver />
        </body>
    </html>
  );
}
