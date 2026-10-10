import { HomeShell } from "@/components/home-shell";
import { getDictionary } from "@/lib/i18n";

export default function GermanHomePage() {
  return <HomeShell locale="de" dictionary={getDictionary("de")} />;
}
