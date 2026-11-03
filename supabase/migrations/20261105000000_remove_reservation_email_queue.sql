-- The website sends one confirmation directly through Resend after booking.
-- No email queue, cancellation worker, webhook, cron job, or reminder is needed.

drop trigger if exists enqueue_reservation_email_jobs on public.reservations;
drop function if exists public.enqueue_reservation_email_jobs();
drop function if exists public.claim_reservation_email_jobs(integer);
drop function if exists public.complete_reservation_email_job(uuid, text);
drop function if exists public.fail_reservation_email_job(uuid, text);
drop table if exists public.reservation_email_jobs;
