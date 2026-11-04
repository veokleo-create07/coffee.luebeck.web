import type { Metadata } from "next";
import { MenuPage as MenuExperiencePage } from "@/components/menu-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "menu", title: "Speisekarte | Matcha, Kaffee & Frühstück | Altstadtliebe", description: "Entdecke die Auswahl von Altstadtliebe: Matcha, Kaffee, Frühstück sowie vegetarische und vegane Optionen mitten in Lübeck." });

export default function MenuPage() {
  return <MenuExperiencePage locale="de" dictionary={getDictionary("de")} />;
}
