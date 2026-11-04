import type { Metadata } from "next";
import { FaqPage } from "@/components/faq-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "faq", title: "Häufige Fragen | Altstadtliebe Lübeck", description: "Antworten zu Öffnungszeiten, Reservierungen, veganen Optionen, Hunden, Feiern und deinem Besuch bei Altstadtliebe in Lübeck." });

export default function FaqRoute() {
  return <FaqPage locale="de" dictionary={getDictionary("de")} />;
}
