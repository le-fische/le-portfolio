import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";

import { SmoothScroller } from "@/components/SmoothScroller";
import { Grain } from "@/components/Grain";
import "./globals.css";

/* Three families, three jobs:
   - Geist          structural text
   - Geist Mono     labels, indices, spec metadata
   - Instrument Serif  the two quote moments and the tuck box wordmark only */
const geist = Geist({ subsets: ["latin"], variable: "--font-geist", display: "swap" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono", display: "swap" });
const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://houzeguo.com"),
  title: {
    default: "Houze Guo — Engineer, Developer, Illusionist",
    template: "%s — Houze Guo",
  },
  description:
    "Portfolio of Houze Guo. Computer engineering, embedded systems, mechanical design, and the occasional sleight of hand.",
  openGraph: {
    type: "website",
    title: "Houze Guo — Engineer, Developer, Illusionist",
    description:
      "Computer engineering, embedded systems, mechanical design, and the occasional sleight of hand.",
  },
};

export const viewport: Viewport = {
  themeColor: "#faf9f6",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${instrument.variable}`}
    >
      <body>
        <SmoothScroller />
        <Grain />
        {children}
      </body>
    </html>
  );
}
