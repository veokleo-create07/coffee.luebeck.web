import { NextResponse } from "next/server";
import { processReservationEmailJobs } from "@/lib/email/process-reservation-emails";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const secret = process.env.EMAIL_PROCESS_SECRET;
  if (!secret) return false;
  return request.headers.get("authorization") === `Bearer ${secret}`;
}

export async function POST(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json(await processReservationEmailJobs());
  } catch (error) {
    console.error("Reservation email queue processing failed", error instanceof Error ? error.message : "Unknown error");
    return NextResponse.json({ error: "Email queue unavailable." }, { status: 503 });
  }
}
