import type { Metadata } from "next";
import { LegalNoticePage } from "@/components/legal-notice-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "legal", title: "Legal Notice | Altstadtliebe", description: "Legal notice and provider information for Altstadtliebe Lübeck.", noIndex: true });

export default function EnglishLegalNoticePage() {
  return <LegalNoticePage locale="en" dictionary={getDictionary("en")} />;
}
