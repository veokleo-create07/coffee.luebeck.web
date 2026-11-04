import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/privacy-policy-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "privacy", title: "Privacy Policy | Altstadtliebe", description: "Privacy policy for Altstadtliebe Lübeck.", noIndex: true });

export default function EnglishPrivacyPage() {
  return <PrivacyPolicyPage locale="en" dictionary={getDictionary("en")} />;
}
