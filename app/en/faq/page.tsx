import type { Metadata } from "next";
import { FaqPage } from "@/components/faq-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "faq", title: "Frequently Asked Questions | Altstadtliebe Lübeck", description: "Answers about opening hours, reservations, vegan options, dogs, private events, and visiting Altstadtliebe in Lübeck." });

export default function EnglishFaqRoute() {
  return <FaqPage locale="en" dictionary={getDictionary("en")} />;
}
