import type { Metadata } from "next";
import { Geist_Mono, Playfair_Display, Inter } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/cart-drawer";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfairDisplay = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LIKEFOOD | Vietnamese Specialty Foods",
  description: "Premium Vietnamese specialty foods, curated for quality and delivered to your doorstep. Live commerce, artisanal flavors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistMono.variable} ${playfairDisplay.variable} ${inter.variable} bg-ivory dark:bg-background-dark text-soft-black dark:text-accent antialiased min-h-screen flex flex-col font-sans`}
      >
        <Header />
        <CartDrawer />
        <main className="flex-1 flex flex-col">
          {children}
        </main>
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
