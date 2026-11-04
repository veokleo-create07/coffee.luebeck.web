import type { Metadata } from "next";
import { DiscoveryPage } from "@/components/discovery-page";
import { discoveryContent } from "@/lib/discovery-content";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "cafe", title: "Café & Breakfast in Lübeck Old Town | Altstadtliebe", description: "Visit Altstadtliebe for breakfast, matcha, and good coffee in a cozy atmosphere in the heart of Lübeck's Old Town.", image: "/menu-breakfast.jpeg" });

export default function CafeLubeckPage() {
  return <DiscoveryPage locale="en" dictionary={getDictionary("en")} content={discoveryContent.cafe.en} page="cafe" />;
}
