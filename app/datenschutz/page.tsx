import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/privacy-policy-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "privacy", title: "Datenschutzerklärung | Altstadtliebe", description: "Datenschutzerklärung von Altstadtliebe Lübeck.", noIndex: true });

export default function GermanPrivacyPage() {
  return <PrivacyPolicyPage locale="de" dictionary={getDictionary("de")} />;
}
