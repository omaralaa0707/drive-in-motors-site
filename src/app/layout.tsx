import type { Metadata } from "next";
import { Antonio, Commissioner, Alyamama, Estedad } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "@/i18n/locale-provider";
import { ar } from "@/content/ar";
import { en } from "@/content/en";

// Their shopfront is set in bold condensed caps with angled cuts. Antonio is
// the closest thing to it with a full weight range.
const antonio = Antonio({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-antonio",
});
const commissioner = Commissioner({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-commissioner",
});
const alyamama = Alyamama({
  subsets: ["arabic"],
  weight: ["400", "500", "700"],
  variable: "--font-alyamama",
});
const estedad = Estedad({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-estedad",
});

export const metadata: Metadata = {
  title: "Drive In Motors — everything on this floor is new | Nasr City, Cairo",
  description:
    "Four 2026 cars, three of them from marques that barely existed in Egypt five years ago, photographed at the kerb outside their own sign. One offer, repeated word for word on every listing, and five ways to phone it in.",
  metadataBase: new URL("https://drive-in-motors-site.vercel.app"),
  icons: { icon: "/mark.svg" },
  openGraph: {
    title: "Drive In Motors — everything on this floor is new",
    description:
      "Four brand-new cars from Jetour, Kaiyi, Changan and Skoda, all Model 2026, photographed at the showroom. Available now.",
    locale: "en_US",
    type: "website",
  },
  other: { "theme-color": "#131a20" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    // translate="no": the page ships hand-written AR/EN copy, and Chrome's
    // auto-translate rewrites `lang`, which would also break every
    // [dir="rtl"] correction if the CSS were keyed off language.
    <html
      lang="en"
      dir="ltr"
      translate="no"
      className={`notranslate ${antonio.variable} ${commissioner.variable} ${alyamama.variable} ${estedad.variable}`}
    >
      <body className="bg-night text-ice antialiased">
        {/* Content turns to face the reader under an intersection observer, so
            without scripting every block would stay turned away and invisible. */}
        <noscript>
          <style>{`[data-turn-inner]{opacity:1!important;transform:none!important;animation:none!important}`}</style>
        </noscript>
        <LocaleProvider dictionaries={{ ar, en }} defaultLocale="en">
          {children}
        </LocaleProvider>
      </body>
    </html>
  );
}
