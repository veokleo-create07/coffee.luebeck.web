import type { Metadata } from "next";
import { FaqPage } from "@/components/faq-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = { title: "FAQ — Altstadtliebe", description: "Antworten auf häufige Fragen zu Altstadtliebe." };

export default function FaqRoute() {
  return <FaqPage locale="de" dictionary={getDictionary("de")} />;
}
