# Reservation staging setup

This project does not currently have a separate Supabase staging project or staging credentials checked into the environment. Do not point the local app or any test runner at the production Supabase project.

## Create the disposable project

1. Create a separate Supabase project named something like `altstadtliebe-staging` in the same organization as production.
2. Record its project reference from the Supabase dashboard.
3. In the staging project, run the versioned migrations in order with the Supabase CLI:

   ```bash
   supabase login
   supabase link --project-ref <staging-project-ref>
   supabase db push
   ```

4. Set the staging booking rules explicitly in the SQL editor. This keeps the test assumptions separate from any production configuration:

   ```sql
   update public.booking_settings
   set total_reservable_capacity = 30,
       reservation_duration_minutes = 90,
       booking_interval_minutes = 30,
       max_online_guests = 6,
       first_reservation_time = '09:00',
       last_reservation_time = '17:00'
   where id = 'default';
   ```

5. Confirm Monday is closed and Tuesday–Sunday are open 09:00–18:00:

   ```sql
   select weekday, is_closed, opens_at, closes_at
   from public.opening_hours
   order by weekday;
   ```

## Local environment

Create `.env.staging.local` locally (never commit it) and use it only while running the staging test server:

```dotenv
NEXT_PUBLIC_SITE_URL=http://127.0.0.1:3010
SUPABASE_URL=https://<staging-project-ref>.supabase.co
NEXT_SERVICE_ROLE_KEY=<staging-service-role-key>
```

The service-role key must remain server-only. Do not use a `NEXT_PUBLIC_` prefix for it and do not paste it into a browser test, screenshot, issue, or log.

## Test cleanup

Use a unique fake email suffix for every run, for example `launch-test-20261103-<random>@example.invalid`. After the run, verify and remove only those records:

```sql
select reservation_reference, customer_email, status
from public.reservations
where customer_email like 'launch-test-20261103-%@example.invalid';

delete from public.reservations
where customer_email like 'launch-test-20261103-%@example.invalid';
```

The test runner must refuse to run unless a staging URL and staging key are present, and it must refuse URLs belonging to the production deployment. No test record should be created until this environment is configured.

## Known configuration check

The UI fallback in `lib/booking-config.ts` currently exposes reservation starts through `16:30`, while the database migration default is `17:00` and the café closes at `18:00`. With a 90-minute duration, `16:30` is the final start that ends at closing. Before launch, choose and document whether `17:00` means the final start time or the opening-hours boundary; the current UI/database values are not identical.
