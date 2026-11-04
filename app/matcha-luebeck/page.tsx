import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
import { discoveryContent } from "@/lib/discovery-content";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "matcha", title: "Matcha in Lübeck | Altstadtliebe", description: "Entdecke Matcha bei Altstadtliebe in der Lübecker Altstadt – zusammen mit Frühstück, Kaffee und einer gemütlichen Auszeit." , image: "/menu-matcha.jpeg" });

export default function MatchaLuebeckPage() {
  return <DiscoveryPage locale="de" dictionary={getDictionary("de")} content={discoveryContent.matcha.de} page="matcha" />;
}
