import type { Metadata } from "next";
import { HomeShell } from "@/components/home-shell";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "home", title: "Altstadtliebe | Café, Matcha & Frühstück in Lübeck", description: "Eine kleine Auszeit im Herzen von Lübeck. Entdecke besonderen Kaffee, Matcha, leckeres Frühstück und die gemütliche Atmosphäre im Altstadtliebe." });

export default function GermanHomePage() {
  return <HomeShell locale="de" dictionary={getDictionary("de")} />;
}
