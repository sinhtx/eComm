import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import { CartProvider } from "@/components/CartProvider";
import { SiteHeader } from "@/components/SiteHeader";
import { TrafficLogger } from "@/components/TrafficLogger";
import { getSiteUrl } from "@/lib/siteUrl";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Mango Tango Farm | Premium Organic Mangoes",
    template: "%s | Mango Tango Farm",
  },
  description:
    "Fresh organic mangoes from Pine Island, Florida. Shop premium varieties, curated mix boxes, and seasonal specials.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Mango Tango Farm",
    title: "Mango Tango Farm | Premium Organic Mangoes",
    description:
      "Fresh organic mangoes from Pine Island, Florida. Handpicked, small-batch.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mango Tango Farm | Premium Organic Mangoes",
    description:
      "Fresh organic mangoes from Pine Island, Florida. Handpicked, small-batch.",
  },
  icons: {
    icon: "/favicon.ico",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#F9F7F4]">
        <CartProvider>
          <TrafficLogger />
          <Link
            href="#main-content"
            className="sr-only focus:fixed focus:z-[100] focus:left-4 focus:top-4 focus:inline-block focus:p-3 focus:bg-amber-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-700"
          >
            Skip to main content
          </Link>
          <SiteHeader />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
