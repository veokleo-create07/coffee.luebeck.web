import type { Metadata } from "next";
import { LegalNoticePage } from "@/components/legal-notice-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum und Anbieterkennzeichnung von Altstadtliebe Lübeck.",
};

export default function GermanLegalNoticePage() {
  return <LegalNoticePage locale="de" dictionary={getDictionary("de")} />;
}
