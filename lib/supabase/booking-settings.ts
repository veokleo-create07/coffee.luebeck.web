import "server-only";

import type { Tables } from "./database.types";
import { createSupabaseAdminClient } from "./server";

export async function getBookingSettings(): Promise<Tables<"booking_settings">> {
  const { data, error } = await createSupabaseAdminClient().from("booking_settings").select("*").eq("id", "default").single();
  if (error) throw new Error(`Could not load booking settings: ${error.message}`);
  return data;
}

export async function getOpeningHours(): Promise<Tables<"opening_hours">[]> {
  const { data, error } = await createSupabaseAdminClient().from("opening_hours").select("*").order("weekday", { ascending: true });
  if (error) throw new Error(`Could not load opening hours: ${error.message}`);
  return data;
}

export async function getOpeningExceptions(from: string, to: string): Promise<Tables<"opening_exceptions">[]> {
  const { data, error } = await createSupabaseAdminClient().from("opening_exceptions").select("*").gte("exception_date", from).lte("exception_date", to).order("exception_date", { ascending: true });
  if (error) throw new Error(`Could not load opening exceptions: ${error.message}`);
  return data;
}
