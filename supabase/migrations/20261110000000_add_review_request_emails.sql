-- Store explicit one-time review-email consent and delivery state.
-- Review requests are sent only for completed reservations with consent.

alter table public.reservations
  add column if not exists review_email_consent_at timestamptz,
  add column if not exists review_email_sent_at timestamptz;

create index if not exists reservations_review_email_ready_idx
  on public.reservations (ends_at)
  where status = 'completed'
    and review_email_consent_at is not null
    and review_email_sent_at is null;

grant select, update on table public.reservations to service_role;
