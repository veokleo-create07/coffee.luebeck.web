import { ReservationPage } from "@/components/reservation-page";
import { getDictionary } from "@/lib/i18n";

export default function EnglishReservationPage() {
  return <ReservationPage locale="en" dictionary={getDictionary("en")} />;
}
