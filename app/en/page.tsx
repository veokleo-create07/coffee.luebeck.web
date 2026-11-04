import type { Metadata } from "next";
import { HomeShell } from "@/components/home-shell";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "home", title: "Altstadtliebe | Café, Matcha & Breakfast in Lübeck", description: "A little escape in the heart of Lübeck. Discover specialty coffee, matcha, delicious breakfast, and the cozy atmosphere of Altstadtliebe." });

export default function EnglishHomePage() {
  return <HomeShell locale="en" dictionary={getDictionary("en")} />;
}
