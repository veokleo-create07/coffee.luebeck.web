import { UtilityPage } from "@/components/utility-page";
import { getDictionary } from "@/lib/i18n";

export default function MenuPage() {
  return <UtilityPage locale="de" dictionary={getDictionary("de")} title="Speisekarte" body="Unsere Speisekarte folgt in Kürze." />;
}
