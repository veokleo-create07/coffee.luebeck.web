import { ReservationPage } from "@/components/reservation-page";
import { getDictionary } from "@/lib/i18n";

export default function GermanReservationPage() {
  return <ReservationPage locale="de" dictionary={getDictionary("de")} />;
}
