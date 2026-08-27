import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-serif" });

import { SmoothScroller } from "@/components/SmoothScroller";
import { Noise } from "@/components/Noise";
import { CustomCursor } from "@/components/CustomCursor";
import { Preloader } from "@/components/Preloader";

export const metadata: Metadata = {
  title: "Aleister Vance | Portfolio",
  description: "Any sufficiently advanced technology is indistinguishable from magic.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body className="antialiased overflow-x-hidden">
        <Preloader />
        <SmoothScroller>
          <Noise />
          <CustomCursor />
          {children}
        </SmoothScroller>
      </body>
    </html>
  );
}
