import type { Metadata } from "next";
import { MenuPage as MenuExperiencePage } from "@/components/menu-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...localizedMetadata({ locale: "en", route: "menu", title: "Menu | Breakfast, Matcha & Coffee | Altstadtliebe", description: "Explore the Altstadtliebe menu in Lübeck: breakfast, bagels, bowls, matcha, coffee, homemade lemonades, and more." }),
};

export default function EnglishMenuPage() {
  return <MenuExperiencePage locale="en" dictionary={getDictionary("en")} />;
}
