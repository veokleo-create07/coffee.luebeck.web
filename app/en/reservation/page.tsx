import { UtilityPage } from "@/components/utility-page";
import { getDictionary } from "@/lib/i18n";

export default function EnglishReservationPage() {
  return <UtilityPage locale="en" dictionary={getDictionary("en")} title="Reservations" body="More information about reservations is coming soon." />;
}
