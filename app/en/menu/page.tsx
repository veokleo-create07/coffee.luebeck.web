import type { Metadata } from "next";
import { MenuPage as MenuExperiencePage } from "@/components/menu-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "menu", title: "Menu | Matcha, Coffee & Breakfast | Altstadtliebe", description: "Explore Altstadtliebe's selection of matcha, coffee, breakfast, and vegetarian and vegan options in Lübeck's Old Town." });

export default function EnglishMenuPage() {
  return <MenuExperiencePage locale="en" dictionary={getDictionary("en")} />;
}
