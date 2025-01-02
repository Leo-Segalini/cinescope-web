import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Layout/Header/Header";
import { Footer } from "@/components/Layout/Footer/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL('https://cinescope.fr'),
  title: {
    default: "CinéScope",
    template: "%s | CinéScope"
  },
  description: "Découvrez, explorez et suivez vos films et séries préférés. CinéScope vous offre une expérience cinématographique complète avec des critiques, des bandes-annonces et des recommandations personnalisées.",
  keywords: ["films", "séries", "streaming", "cinéma", "critiques", "bandes-annonces", "acteurs", "réalisateurs", "anime"],
  authors: [{ name: "CinéScope" }],
  creator: "CinéScope",
  publisher: "CinéScope",
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "fr_FR",
    url: "https://cinescope.fr",
    siteName: "CinéScope",
    title: "CinéScope - Votre guide cinématographique",
    description: "Découvrez, explorez et suivez vos films et séries préférés. CinéScope vous offre une expérience cinématographique complète.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "CinéScope"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "CinéScope - Votre guide cinématographique",
    description: "Découvrez, explorez et suivez vos films et séries préférés",
    images: ["/logo-nobg.png"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  manifest: "/manifest.json",
  category: "entertainment",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0f172a"
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col bg-black text-white">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
