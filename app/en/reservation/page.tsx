import type { Metadata } from "next";
import { ReservationPage } from "@/components/reservation-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "en", route: "reservation", title: "Reserve a Table | Altstadtliebe Lübeck", description: "Reserve your table at Altstadtliebe in Lübeck's Old Town for breakfast, matcha, and good coffee." });

export default function EnglishReservationPage() {
  return <ReservationPage locale="en" dictionary={getDictionary("en")} />;
}
