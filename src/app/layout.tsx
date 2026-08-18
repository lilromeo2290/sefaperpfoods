import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Sefaperp Foods — Quality, Taste and Trust",
    template: "%s | Sefaperp Foods",
  },
  description:
    "Authentic Ghanaian food products from Dzodze, Volta Region. Quality, Taste and Trust. Shop Shitor, Tom Brown and more — fresh delivery across Ghana. Pay with Mobile Money or card.",
  keywords: [
    "Ghanaian food",
    "Shitor",
    "Tom Brown",
    "Dzodze",
    "Volta Region",
    "Ghana food delivery",
    "Mobile Money shopping Ghana",
    "Sefaperp Foods",
    "buy shitor online",
    "Quality Taste Trust",
  ],
  authors: [{ name: "Sefaperp Foods" }],
  creator: "Sefaperp Foods",
  publisher: "Sefaperp Foods",
  applicationName: "Sefaperp Foods",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  appleWebApp: {
    capable: true,
    title: "Sefaperp Foods",
    statusBarStyle: "black-translucent",
  },
  formatDetection: { telephone: true },
  openGraph: {
    title: "Sefaperp Foods — Quality, Taste and Trust",
    description:
      "Authentic Ghanaian food products from Dzodze, Volta Region. Shop Shitor, Tom Brown and more. Mobile Money & card payments. Fresh delivery across Ghana.",
    url: "https://sbffoods.com",
    siteName: "Sefaperp Foods",
    type: "website",
    locale: "en_GH",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sefaperp Foods — Quality, Taste and Trust",
    description: "Authentic Ghanaian food products from Dzodze. Mobile Money & card. Fresh delivery across Ghana.",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#1A0A0C" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="application-name" content="Sefaperp Foods" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Sefaperp Foods" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="msapplication-TileColor" content="#6B1C23" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', async () => {
                  try {
                    const registrations = await navigator.serviceWorker.getRegistrations();
                    for (const reg of registrations) {
                      await reg.unregister();
                    }
                    if ('caches' in window) {
                      const keys = await caches.keys();
                      for (const k of keys) {
                        await caches.delete(k);
                      }
                    }
                    await navigator.serviceWorker.register('/sw.js?v=' + Date.now());
                  } catch (e) {}
                });
              }
            `,
          }}
        />
        {/* Critical custom utilities — injected inline to bypass Turbopack CSS cache issues */}
        <style dangerouslySetInnerHTML={{
          __html: `
            .gradient-brown, .gradient-burgundy {
              background: linear-gradient(135deg, #8B2A33 0%, #6B1C23 50%, #4A0F14 100%) !important;
            }
            .gradient-gold {
              background: linear-gradient(135deg, #E8D5A3 0%, #D4AF37 50%, #B8943D 100%) !important;
            }
            .gradient-hero {
              background:
                radial-gradient(ellipse at top, rgba(212, 175, 55, 0.35), transparent 60%),
                radial-gradient(ellipse at bottom right, rgba(107, 28, 35, 0.25), transparent 60%),
                linear-gradient(180deg, #FAF8F5 0%, #FDFBF7 100%) !important;
            }
            .glass {
              background: rgba(250, 248, 245, 0.75) !important;
              backdrop-filter: blur(12px);
              -webkit-backdrop-filter: blur(12px);
              border: 1px solid rgba(212, 175, 55, 0.25);
            }
            .shadow-gold {
              box-shadow: 0 10px 30px -10px rgba(212, 175, 55, 0.6) !important;
            }
            .shadow-brown {
              box-shadow: 0 10px 30px -10px rgba(107, 28, 35, 0.4) !important;
            }
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
        <Sonner />
      </body>
    </html>
  );
}
<!-- Vercel auto-deploy verified: Tue Aug 18 10:34:42 UTC 2026 -->
