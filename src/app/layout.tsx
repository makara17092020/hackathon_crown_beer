// src/app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import AuthProvider from "@/components/AuthProvider";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Cambodian Craft Beer Crown 2026",
  description:
    "Help us crown the best brew at the Great Cambodian Craft Beer Festival!",
  icons: {
    icon: "/images/BeerFestival.png", // This points to your logo in the images folder
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${poppins.className} flex flex-col min-h-screen bg-amber-50 text-gray-900`}
      >
        <AuthProvider>
          <Header />
          <main className="flex-1 container mx-auto p-4">{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
