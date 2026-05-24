import type { Metadata } from "next";
import Link from "next/link";
import { Geist, Geist_Mono } from "next/font/google";
import { Footer } from "@/components/Footer";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Seasonal Fruit Farm - Premium Organic Mangoes",
  description: "Fresh, handpicked premium organic mangoes from our sustainable orchards",
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
      <body className="min-h-full flex flex-col">
        <header className="bg-white border-b border-slate-200 shadow-sm sticky top-0 z-10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Seasonal Fruit Farm</h1>
              <p className="text-slate-600 text-sm mt-1">Handpicked Premium Organic Mangoes</p>
            </div>
            <nav className="flex gap-8">
              <Link href="/" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">
                About
              </Link>
              <Link href="/contact" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">
                Contact
              </Link>
              <Link href="/shop" className="text-slate-700 hover:text-amber-600 font-medium transition-colors">
                Shop
              </Link>
            </nav>
          </div>
        </header>
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
