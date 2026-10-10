import { UtilityPage } from "@/components/utility-page";
import { getDictionary } from "@/lib/i18n";

export default function ReservationPage() {
  return <UtilityPage locale="de" dictionary={getDictionary("de")} title="Tisch reservieren" body="Weitere Informationen zu Reservierungen folgen in Kürze." />;
}
