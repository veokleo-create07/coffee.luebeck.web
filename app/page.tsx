import type { Metadata } from "next";
import { HomeShell } from "@/components/home-shell";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  description: "Eine kleine Auszeit im Herzen von Lübeck. Entdecke besonderen Kaffee, Matcha, leckeres Frühstück und die gemütliche Atmosphäre im Altstadtliebe.",
  openGraph: {
    description: "Eine kleine Auszeit im Herzen von Lübeck. Entdecke besonderen Kaffee, Matcha, leckeres Frühstück und die gemütliche Atmosphäre im Altstadtliebe.",
  },
};

export default function GermanHomePage() {
  return <HomeShell locale="de" dictionary={getDictionary("de")} />;
}
