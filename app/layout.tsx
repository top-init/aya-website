import type { Metadata, Viewport } from "next";
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${cormorant.variable} ${playfair.variable}`}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
