import type { Metadata } from "next";
import { headers } from "next/headers";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricology = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://altstadtliebe.vercel.app"),
  title: {
    default: "Altstadtliebe — Café in Lübeck",
    template: "%s — Altstadtliebe",
  },
  description: "Altstadtliebe — ein Café für guten Kaffee und die kleinen Pausen, die bleiben.",
  applicationName: "Altstadtliebe",
  icons: {
    icon: [{ url: "/altstadtliebe-logo.png", type: "image/png" }],
    shortcut: ["/altstadtliebe-logo.png"],
  },
  authors: [{ name: "Altstadtliebe" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Altstadtliebe",
    title: "Altstadtliebe — Café in Lübeck",
    description: "Ein Café für guten Kaffee und die kleinen Pausen, die bleiben.",
    url: "/",
  },
};

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const locale = (await headers()).get("x-altstadtliebe-locale") === "en" ? "en" : "de";
  return (
    <html lang={locale} className={bricology.variable}>
      <body>{children}</body>
    </html>
  );
}
