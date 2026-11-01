import type { Metadata } from "next";
import { FaqPage } from "@/components/faq-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { title: "FAQ — Altstadtliebe", description: "Answers to common questions about Altstadtliebe." };

export default function EnglishFaqRoute() {
  return <FaqPage locale="en" dictionary={getDictionary("en")} />;
}
