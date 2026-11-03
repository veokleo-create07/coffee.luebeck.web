import type { Metadata } from "next";
import { HomeShell } from "@/components/home-shell";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Altstadtliebe — Café in Lübeck",
  description: "A little escape in the heart of Lübeck. Discover specialty coffee, matcha, delicious breakfast, and the cozy atmosphere of Altstadtliebe.",
  openGraph: {
    locale: "en_GB",
    title: "Altstadtliebe — Café in Lübeck",
    description: "A little escape in the heart of Lübeck. Discover specialty coffee, matcha, delicious breakfast, and the cozy atmosphere of Altstadtliebe.",
  },
};

export default function EnglishHomePage() {
  return <HomeShell locale="en" dictionary={getDictionary("en")} />;
}
