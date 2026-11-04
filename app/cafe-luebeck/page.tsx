import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
import { discoveryContent } from "@/lib/discovery-content";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "cafe", title: "Café & Frühstück in Lübecks Altstadt | Altstadtliebe", description: "Besuche Altstadtliebe für Frühstück, Matcha und guten Kaffee in gemütlicher Atmosphäre mitten in Lübecks Altstadt.", image: "/menu-breakfast.jpeg" });

export default function CafeLuebeckPage() {
  return <DiscoveryPage locale="de" dictionary={getDictionary("de")} content={discoveryContent.cafe.de} page="cafe" />;
}
