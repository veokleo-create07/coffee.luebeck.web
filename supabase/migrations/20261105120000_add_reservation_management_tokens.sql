-- Store only a one-way hash of each customer reservation-management token.
-- The raw token exists only in the confirmation email and customer URL.

alter table public.reservations
  add column if not exists management_token_hash text;

alter table public.reservations
  drop constraint if exists reservations_management_token_hash_format;

alter table public.reservations
  add constraint reservations_management_token_hash_format
  check (management_token_hash is null or management_token_hash ~ '^[a-f0-9]{64}$');

create unique index if not exists reservations_management_token_hash_idx
  on public.reservations (management_token_hash)
  where management_token_hash is not null;

comment on column public.reservations.management_token_hash is
  'SHA-256 hash of the secret URL token used for customer self-service management.';
