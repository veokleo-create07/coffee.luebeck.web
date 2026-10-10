import type { Metadata } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import "./globals.css";

const bricology = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-bricolage",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "Altstadtliebe — Café in Lübeck",
    template: "%s — Altstadtliebe",
  },
  description: "Altstadtliebe — ein Café für guten Kaffee und die kleinen Pausen, die bleiben.",
  applicationName: "Altstadtliebe",
  authors: [{ name: "Altstadtliebe" }],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: "Altstadtliebe",
    title: "Altstadtliebe — Café in Lübeck",
    description: "Ein Café für guten Kaffee und die kleinen Pausen, die bleiben.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="de" className={bricology.variable}>
      <body>{children}</body>
    </html>
  );
}
