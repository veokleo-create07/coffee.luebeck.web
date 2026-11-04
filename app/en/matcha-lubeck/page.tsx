import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
import { discoveryContent } from "@/lib/discovery-content";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "matcha", title: "Matcha in Lübeck | Altstadtliebe", description: "Discover matcha at Altstadtliebe in Lübeck's Old Town, together with breakfast, coffee, and a cozy café atmosphere.", image: "/menu-matcha.jpeg" });

export default function MatchaLubeckPage() {
  return <DiscoveryPage locale="en" dictionary={getDictionary("en")} content={discoveryContent.matcha.en} page="matcha" />;
}
