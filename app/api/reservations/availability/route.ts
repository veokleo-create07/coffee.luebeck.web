import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/supabase/reservation-engine";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get("date") ?? "";
  const guests = Number(searchParams.get("guests") ?? "2");

  if (!Number.isInteger(guests) || guests < 1 || guests > 6) {
    return NextResponse.json({ error: "Invalid guest count." }, { status: 400 });
  }

  try {
    return NextResponse.json(await getAvailability(date, guests), { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Availability lookup failed", error);
    return NextResponse.json({ error: "Availability lookup failed." }, { status: 500 });
  }
}
