import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/Layout/Header/Header";
import { Footer } from "@/components/Layout/Footer/Footer";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TMDB App",
  description: "Application de films et séries utilisant l'API TMDB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
