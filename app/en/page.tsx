import type { Metadata } from "next";
import { HomeShell } from "@/components/home-shell";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "Altstadtliebe — Café in Lübeck",
  description: "Altstadtliebe — a café for good coffee and the small pauses worth keeping.",
  openGraph: {
    locale: "en_GB",
    title: "Altstadtliebe — Café in Lübeck",
    description: "A café for good coffee and the small pauses worth keeping.",
  },
};

export default function EnglishHomePage() {
  return <HomeShell locale="en" dictionary={getDictionary("en")} />;
}
