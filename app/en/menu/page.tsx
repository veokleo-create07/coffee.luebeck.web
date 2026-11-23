import type { Metadata } from "next";
import { MenuPage as MenuExperiencePage } from "@/components/menu-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...localizedMetadata({ locale: "en", route: "menu", title: "Menu coming soon | Altstadtliebe", description: "We’re currently preparing Altstadtliebe’s new menu. Our complete selection will be available here soon." }),
  robots: { index: false, follow: true },
};

export default function EnglishMenuPage() {
  return <MenuExperiencePage locale="en" dictionary={getDictionary("en")} />;
}
