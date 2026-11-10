-- Store explicit one-time review-email consent.
-- The dashboard sends the request when staff completes the visit.

alter table public.reservations
  add column if not exists review_email_consent_at timestamptz;

grant select, update on table public.reservations to service_role;
