import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/privacy-policy-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von Altstadtliebe Lübeck.",
};

export default function GermanPrivacyPage() {
  return <PrivacyPolicyPage locale="de" dictionary={getDictionary("de")} />;
}
