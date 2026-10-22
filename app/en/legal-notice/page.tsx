import type { Metadata } from "next";
import { LegalNoticePage } from "@/components/legal-notice-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Legal Notice",
  description: "Legal notice and provider information for Altstadtliebe Lübeck.",
};

export default function EnglishLegalNoticePage() {
  return <LegalNoticePage locale="en" dictionary={getDictionary("en")} />;
}
