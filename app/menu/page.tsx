import type { Metadata } from "next";
import { MenuPage as MenuExperiencePage } from "@/components/menu-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = {
  ...localizedMetadata({ locale: "de", route: "menu", title: "Speisekarte | Frühstück, Matcha & Kaffee | Altstadtliebe", description: "Entdecke die Speisekarte von Altstadtliebe in Lübeck: Frühstück, Bagels, Bowls, Matcha, Kaffee, hausgemachte Limonaden und mehr." }),
};

export default function MenuPage() {
  return <MenuExperiencePage locale="de" dictionary={getDictionary("de")} />;
}
