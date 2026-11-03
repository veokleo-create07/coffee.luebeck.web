# Supabase database foundation

The reservation page reads availability and submits reservations through the server-only API routes. The deployable database schema, including the atomic booking RPC, capacity guard, and transactional email outbox, lives in `supabase/migrations/`.

For a disposable database and the exact staging environment variables required for end-to-end reservation testing, see [`docs/supabase-staging.md`](./supabase-staging.md). Never run reservation tests against production.

## Connect an existing Supabase project

1. Create or open the existing Supabase project.
2. Copy the project URL and service-role key into a local `.env.local` file using `.env.example` as the template:

   ```dotenv
   SUPABASE_URL=https://your-project-ref.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
   ```

   The service-role key is server-only. Do not prefix it with `NEXT_PUBLIC_`, commit it, or use it in client components.

3. Install the Supabase CLI if it is not already available, authenticate, and link the project:

   ```bash
   supabase login
   supabase link --project-ref <project-ref>
   ```

4. Apply all version-controlled migrations:

   ```bash
   supabase db push
   ```

   Alternatively, paste the migration in `supabase/migrations/20261019000000_reservation_foundation.sql` into the Supabase SQL editor.

## Schema and security

The migrations create the reservation, opening-hours, and centralized booking-settings tables, plus the atomic reservation RPC. They seed only the verified weekly hours and booking rules; they do not create physical table-management data or fictional reservations.

Row Level Security is enabled on every table, and direct `anon` and `authenticated` table privileges are revoked. The server utility uses only `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS and must remain on the server. No API route or booking submission is connected yet.

## Types and server utilities

`lib/supabase/database.types.ts` contains the checked-in TypeScript model for the migrations. If the schema changes after connecting a project, regenerate types with the Supabase CLI and review the diff before committing:

```bash
supabase gen types typescript --linked > lib/supabase/database.types.ts
```

`lib/supabase/server.ts` exposes the server-only admin client. `lib/supabase/booking-settings.ts` provides server-only reads for booking settings and opening schedules. The live availability and reservation API routes use the same server-only client and the atomic booking RPC.

## Email outbox and worker

`20261103000000_reservation_email_outbox.sql` plus the follow-up simplification migration add a private `reservation_email_jobs` outbox for confirmations and cancellations only. Inserts create confirmation jobs, and dashboard status changes to `cancelled` create cancellation jobs. The protected `POST /api/email/process` route claims jobs with `FOR UPDATE SKIP LOCKED`, sends them through Resend with a stable `Idempotency-Key`, and records success or retry state. Successful bookings process the queue immediately; a trusted dashboard process or Supabase Database Webhook should call the same endpoint after a cancellation. There are no cron jobs or scheduled reminders.

Required server-only Vercel variables:

```dotenv
RESEND_API_KEY=re_...
RESEND_FROM_EMAIL=Altstadtliebe <reservierungen@altstadtliebe.de>
RESEND_REPLY_TO=hello@your-verified-domain.example
EMAIL_PROCESS_SECRET=<long-random-secret>
```

The Resend sending domain must be verified before delivery. Keep all server-only values out of client code, `NEXT_PUBLIC_*` variables, screenshots, and Git. The worker returns `503` without sending if Resend is not configured. Configure the dashboard/Supabase webhook with `POST https://your-domain.example/api/email/process` and `Authorization: Bearer <EMAIL_PROCESS_SECRET>` after a reservation changes to `cancelled`. The route is intentionally on-demand rather than scheduled.
