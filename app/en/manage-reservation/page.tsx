import type { Metadata } from "next";
import { ManageReservationPage } from "@/components/manage-reservation-page";
import { getDictionary } from "@/lib/i18n";

export const metadata: Metadata = {
  title: { absolute: "Manage your reservation | Altstadtliebe" },
  robots: { index: false, follow: false },
  referrer: "no-referrer",
};

export default async function EnglishManageReservationPage({ searchParams }: { searchParams: Promise<{ token?: string }> }) {
  const { token = "" } = await searchParams;
  return <ManageReservationPage locale="en" dictionary={getDictionary("en")} token={token} />;
}
