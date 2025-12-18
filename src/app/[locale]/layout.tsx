import "../../assets/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import React from "react";

import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KinXplore - Kinshasa Trip Planner",
  description:
    "Experience the vibrant heart of the DRC. Plan your perfect journey in Kinshasa with AI-powered itineraries.",
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html suppressHydrationWarning={true} lang={locale}>
      <body className={`${inter.className} antialiased`}>
        <Providers locale={locale}>{children}</Providers>
      </body>
    </html>
  );
}
