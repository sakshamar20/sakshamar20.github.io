import type { Metadata } from "next";
import { Playfair_Display, JetBrains_Mono, Instrument_Serif, Poppins, Krub } from "next/font/google";
import { Noto_Serif_JP, Noto_Serif_SC } from "next/font/google";
import { Nanum_Myeongjo, Amiri } from "next/font/google";
import "./globals.css";
import ThemeProvider from "@/components/ThemeProvider";
import ScrollProgress from "@/components/ScrollProgress";
import PageLoader from "@/components/PageLoader";

// Body font: Teachers (loaded via Google Fonts link below — not yet in next/font).
// Swap the family in tailwind.config.ts → fontFamily.sans when changing later.

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-noto-jp",
  display: "swap",
});

const notoSerifSC = Noto_Serif_SC({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-noto-sc",
  display: "swap",
});

const krub = Krub({
  subsets: ["latin", "thai"],
  weight: ["400", "500", "600"],
  variable: "--font-krub",
  display: "swap",
});

const nanumMyeongjo = Nanum_Myeongjo({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-nanum",
  display: "swap",
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
  variable: "--font-amiri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Saksham Arora",
  description:
    "Saksham Arora — data scientist working on causal inference and real-time ranking at Flipkart, incoming MS Statistics & Computer Science at Purdue. Photographer.",
  openGraph: {
    title: "Saksham Arora",
    description:
      "Data scientist · causal inference and ranking at Flipkart, incoming MS Stats & CS at Purdue. Photographer.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${jetbrains.variable} ${instrumentSerif.variable} ${poppins.variable} ${notoSerifJP.variable} ${notoSerifSC.variable} ${krub.variable} ${nanumMyeongjo.variable} ${amiri.variable}`}
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Teachers:ital,wght@0,400..800;1,400..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans bg-background text-primary">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ScrollProgress />
          <PageLoader />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
