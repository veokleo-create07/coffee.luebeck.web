import type { Metadata } from "next";
import { ReservationPage } from "@/components/reservation-page";
import { getDictionary } from "@/lib/i18n";
import { localizedMetadata } from "@/lib/seo";

export const metadata: Metadata = localizedMetadata({ locale: "de", route: "reservation", title: "Tisch reservieren | Altstadtliebe Lübeck", description: "Reserviere deinen Tisch bei Altstadtliebe in Lübecks Altstadt für Frühstück, Matcha und guten Kaffee." });

export default function GermanReservationPage() {
  return <ReservationPage locale="de" dictionary={getDictionary("de")} />;
}
