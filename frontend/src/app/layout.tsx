import { Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/cart-drawer";
import { ClientLayout } from "@/components/layout/ClientLayout";
import { Toaster } from "sonner";
import { Suspense } from "react";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "LIKEFOOD | Vietnamese Specialty Live Commerce",
  description: "Authentic Vietnamese specialty foods delivered in the U.S. with immersive live shopping experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,500;0,600;0,700;0,900;1,400;1,500&family=Public+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Inter:wght@300;400;500;600;700&display=swap"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistMono.variable} bg-ivory dark:bg-background-dark text-soft-black dark:text-accent antialiased min-h-screen flex flex-col font-sans`}
      >
        <Suspense fallback={null}>
          <ClientLayout>
            <Toaster 
              position="top-right" 
              expand={true} 
              richColors 
              visibleToasts={5}
              gap={12}
              offset="100px"
              toastOptions={{
                style: { 
                  marginTop: '20px',
                  borderRadius: '12px',
                  border: '1px solid rgba(139, 30, 45, 0.1)',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                }
              }}
            />
            <CartDrawer />
            <main className="flex-1 flex flex-col">
              {children}
            </main>
          </ClientLayout>
        </Suspense>
      </body>
    </html>
  );
}
