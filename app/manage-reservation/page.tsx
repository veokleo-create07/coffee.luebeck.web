import type { Metadata } from "next";
import { ManageReservationPage } from "@/components/manage-reservation-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "Reservierung verwalten | Altstadtliebe" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function GermanManageReservationPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <ManageReservationPage locale="de" dictionary={getDictionary("de")} token={token} />;
}
