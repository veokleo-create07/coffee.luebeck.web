import { UtilityPage } from "@/components/utility-page";
import { getDictionary } from "@/lib/i18n";

export default function EnglishMenuPage() {
  return <UtilityPage locale="en" dictionary={getDictionary("en")} title="Menu" body="Our menu is coming soon." />;
}
