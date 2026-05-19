import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Image from "next/image";
import { Cormorant_Garamond, Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-jakarta",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  style: ["italic"],
  variable: "--font-playfair",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fromaya.com"),
  title: {
    default: "Aya — Manifest your dream self",
    template: "%s · Aya",
  },
  description:
    "Aya turns the version of you you've been imagining into a daily practice. Manifestations, gratitude, vision boards and morning rituals — designed to feel like a sunrise.",
  applicationName: "Aya",
  keywords: [
    "manifestation app",
    "manifest your dream self",
    "gratitude app",
    "vision board app",
    "affirmations",
    "morning ritual",
    "law of attraction",
  ],
  authors: [{ name: "Lit Apps Lab LLC" }],
  openGraph: {
    title: "Aya — Manifest your dream self",
    description:
      "Manifestations, gratitude, vision boards and morning rituals — designed to feel like a sunrise.",
    url: "https://fromaya.com",
    siteName: "Aya",
    type: "website",
    images: ["/appicon.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aya — Manifest your dream self",
    description:
      "Manifestations, gratitude, vision boards and morning rituals — designed to feel like a sunrise.",
    images: ["/appicon.png"],
  },
  icons: {
    icon: "/favicon.png",
    apple: "/appicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#8E6B7F",
  width: "device-width",
  initialScale: 1,
};

const APP_STORE_URL =
  "https://apps.apple.com/us/app/aya-manifest-your-dream-self/id6760195623";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable} ${playfair.variable}`}>
      <body className="min-h-screen flex flex-col">
        <header className="border-b border-[var(--color-border-subtle)] bg-[color-mix(in_srgb,var(--color-canvas)_85%,transparent)] backdrop-blur sticky top-0 z-50">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <Image
                src="/logo.png"
                alt="Aya logo"
                width={36}
                height={36}
                priority
                className="rounded-lg"
              />
              <span className="t-title2 text-[var(--color-text-primary)]">
                Aya
              </span>
            </Link>
            <nav className="flex items-center gap-4 sm:gap-7">
              <Link
                href="/support"
                className="hidden sm:inline t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Support
              </Link>
              <Link
                href="/privacy"
                className="hidden sm:inline t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Privacy
              </Link>
              <Link
                href="/terms"
                className="hidden sm:inline t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Terms
              </Link>
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center rounded-full bg-[var(--color-brand)] hover:bg-[var(--color-brand-hover)] text-white t-label px-4 py-2 transition-colors"
              >
                Get the app
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-[var(--color-border-subtle)] bg-[var(--color-surface-subtle)]">
          <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 grid gap-10 sm:grid-cols-[1fr_auto] items-start">
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <Image
                  src="/logo.png"
                  alt=""
                  width={28}
                  height={28}
                  className="rounded-md"
                />
                <span className="t-title3 text-[var(--color-text-primary)]">
                  Aya
                </span>
              </div>
              <p className="t-body text-[var(--color-text-secondary)] max-w-md">
                Manifest your dream self. Manifestations, gratitude, vision
                boards and morning rituals — designed to feel like a sunrise.
              </p>
              <p className="t-caption text-[var(--color-text-tertiary)] pt-3">
                © {new Date().getFullYear()} Lit Apps Lab LLC. All rights reserved.
                <br />
                30 N Gould St Ste R, Sheridan WY 82801, United States.
              </p>
            </div>
            <nav className="grid grid-cols-2 gap-x-10 gap-y-2.5">
              <Link
                href="/support"
                className="t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Support
              </Link>
              <Link
                href="/privacy"
                className="t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Privacy
              </Link>
              <Link
                href="/delete-account"
                className="t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Delete account
              </Link>
              <Link
                href="/terms"
                className="t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
              >
                Terms
              </Link>
              <a
                href="mailto:info@ltiappslab.com"
                className="t-label text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] col-span-2"
              >
                info@ltiappslab.com
              </a>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}
