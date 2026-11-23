import type { Metadata } from "next";
import { MenuPage as MenuExperiencePage } from "@/components/menu-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...localizedMetadata({ locale: "de", route: "menu", title: "Speisekarte kommt bald | Altstadtliebe", description: "Wir arbeiten gerade an der neuen Speisekarte von Altstadtliebe. Schon bald findest du hier unser vollständiges Angebot." }),
  robots: { index: false, follow: true },
};

export default function MenuPage() {
  return <MenuExperiencePage locale="de" dictionary={getDictionary("de")} />;
}
