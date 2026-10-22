import type { Metadata } from "next";
import { PrivacyPolicyPage } from "@/components/privacy-policy-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for Altstadtliebe Lübeck.",
};

export default function EnglishPrivacyPage() {
  return <PrivacyPolicyPage locale="en" dictionary={getDictionary("en")} />;
}
