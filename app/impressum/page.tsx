import type { Metadata } from "next";
import { LegalNoticePage } from "@/components/legal-notice-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "legal", title: "Impressum | Altstadtliebe", description: "Impressum und Anbieterkennzeichnung von Altstadtliebe Lübeck.", noIndex: true });

export default function GermanLegalNoticePage() {
  return <LegalNoticePage locale="de" dictionary={getDictionary("de")} />;
}
