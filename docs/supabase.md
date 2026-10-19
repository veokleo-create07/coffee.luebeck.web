# Supabase database foundation

This repository contains the reservation database foundation only. The existing reservation page still uses its frontend demo state; it does not read from or write to Supabase.

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

4. Apply the version-controlled migration:

   ```bash
   supabase db push
   ```

   Alternatively, paste the migration in `supabase/migrations/20261019000000_reservation_foundation.sql` into the Supabase SQL editor.

## Schema and security

The migration creates the reservation tables, opening-hours tables, and centralized booking settings. It seeds only the verified weekly hours and booking rules; it deliberately creates no physical café tables and no fictional reservations.

Row Level Security is enabled on every table, and direct `anon` and `authenticated` table privileges are revoked. The server utility uses only `SUPABASE_SERVICE_ROLE_KEY`, which bypasses RLS and must remain on the server. No API route or booking submission is connected yet.

## Types and server utilities

`lib/supabase/database.types.ts` contains the checked-in TypeScript model for the migration. If the schema changes after connecting a project, regenerate types with the Supabase CLI and review the diff before committing:

```bash
supabase gen types typescript --linked > lib/supabase/database.types.ts
```

`lib/supabase/server.ts` exposes the server-only admin client. `lib/supabase/booking-settings.ts` provides server-only reads for booking settings and opening schedules for a future availability implementation.
