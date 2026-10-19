-- Altstadtliebe reservation foundation.
-- Apply with `supabase db push` after linking an existing Supabase project.

create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table if not exists public.cafe_tables (
  id uuid primary key default gen_random_uuid(),
  table_identifier text not null unique,
  seating_capacity integer not null check (seating_capacity > 0),
  is_active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_reference text not null unique default ('ALT-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 10))),
  customer_name text not null check (char_length(btrim(customer_name)) between 1 and 160),
  customer_email text not null check (char_length(btrim(customer_email)) between 3 and 320),
  guest_count integer not null check (guest_count > 0),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  special_requests text check (special_requests is null or char_length(special_requests) <= 2000),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  language text not null default 'de' check (language in ('de', 'en')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (ends_at > starts_at)
);

create table if not exists public.reservation_table_assignments (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  cafe_table_id uuid not null references public.cafe_tables(id) on delete restrict,
  created_at timestamptz not null default timezone('utc', now()),
  unique (reservation_id, cafe_table_id)
);

create table if not exists public.opening_hours (
  id uuid primary key default gen_random_uuid(),
  weekday smallint not null unique check (weekday between 1 and 7),
  is_closed boolean not null default false,
  opens_at time,
  closes_at time,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check ((is_closed and opens_at is null and closes_at is null) or (not is_closed and opens_at is not null and closes_at is not null and closes_at > opens_at))
);

create table if not exists public.opening_exceptions (
  id uuid primary key default gen_random_uuid(),
  exception_date date not null unique,
  is_closed boolean not null default true,
  opens_at time,
  closes_at time,
  reason text check (reason is null or char_length(reason) <= 500),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check ((is_closed and opens_at is null and closes_at is null) or (not is_closed and opens_at is not null and closes_at is not null and closes_at > opens_at))
);

create table if not exists public.booking_settings (
  id text primary key default 'default' check (id = 'default'),
  time_zone text not null default 'Europe/Berlin',
  reservation_duration_minutes integer not null default 90 check (reservation_duration_minutes > 0),
  booking_interval_minutes integer not null default 30 check (booking_interval_minutes > 0),
  max_online_guests integer not null default 6 check (max_online_guests between 1 and 50),
  advance_booking_months integer not null default 6 check (advance_booking_months between 0 and 24),
  first_reservation_time time not null default '09:00',
  last_reservation_time time not null default '17:00',
  larger_party_contact text not null default 'telephone',
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  check (last_reservation_time >= first_reservation_time)
);

create index if not exists reservations_starts_at_idx on public.reservations (starts_at);
create index if not exists reservations_status_starts_at_idx on public.reservations (status, starts_at);
create index if not exists reservations_customer_email_idx on public.reservations (lower(customer_email));
create index if not exists reservation_table_assignments_reservation_id_idx on public.reservation_table_assignments (reservation_id);
create index if not exists reservation_table_assignments_cafe_table_id_idx on public.reservation_table_assignments (cafe_table_id);
create index if not exists opening_exceptions_date_idx on public.opening_exceptions (exception_date);

drop trigger if exists set_cafe_tables_updated_at on public.cafe_tables;
create trigger set_cafe_tables_updated_at before update on public.cafe_tables for each row execute function public.set_updated_at();
drop trigger if exists set_reservations_updated_at on public.reservations;
create trigger set_reservations_updated_at before update on public.reservations for each row execute function public.set_updated_at();
drop trigger if exists set_opening_hours_updated_at on public.opening_hours;
create trigger set_opening_hours_updated_at before update on public.opening_hours for each row execute function public.set_updated_at();
drop trigger if exists set_opening_exceptions_updated_at on public.opening_exceptions;
create trigger set_opening_exceptions_updated_at before update on public.opening_exceptions for each row execute function public.set_updated_at();
drop trigger if exists set_booking_settings_updated_at on public.booking_settings;
create trigger set_booking_settings_updated_at before update on public.booking_settings for each row execute function public.set_updated_at();

insert into public.opening_hours (weekday, is_closed, opens_at, closes_at)
values
  (1, true, null, null),
  (2, false, '09:00', '18:00'),
  (3, false, '09:00', '18:00'),
  (4, false, '09:00', '18:00'),
  (5, false, '09:00', '18:00'),
  (6, false, '09:00', '18:00'),
  (7, false, '09:00', '18:00')
on conflict (weekday) do nothing;

insert into public.booking_settings (id)
values ('default')
on conflict (id) do nothing;

create or replace function public.validate_reservation_guest_count()
returns trigger
language plpgsql
as $$
declare
  configured_max integer;
begin
  select max_online_guests into configured_max from public.booking_settings where id = 'default';
  if configured_max is null or new.guest_count > configured_max then
    raise exception 'Guest count exceeds the configured online reservation limit';
  end if;
  return new;
end;
$$;

drop trigger if exists validate_reservation_guest_count on public.reservations;
create trigger validate_reservation_guest_count before insert or update of guest_count on public.reservations for each row execute function public.validate_reservation_guest_count();

alter table public.cafe_tables enable row level security;
alter table public.reservations enable row level security;
alter table public.reservation_table_assignments enable row level security;
alter table public.opening_hours enable row level security;
alter table public.opening_exceptions enable row level security;
alter table public.booking_settings enable row level security;

revoke all on table public.cafe_tables from anon, authenticated;
revoke all on table public.reservations from anon, authenticated;
revoke all on table public.reservation_table_assignments from anon, authenticated;
revoke all on table public.opening_hours from anon, authenticated;
revoke all on table public.opening_exceptions from anon, authenticated;
revoke all on table public.booking_settings from anon, authenticated;
