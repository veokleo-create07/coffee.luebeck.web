-- Make the reservation RPC part of the deployable schema.
-- The advisory transaction lock plus the capacity check prevents concurrent
-- requests from booking beyond the configured guest capacity.

alter table public.booking_settings
  add column if not exists total_reservable_capacity integer not null default 24;

alter table public.booking_settings
  drop constraint if exists booking_settings_total_reservable_capacity_check;

alter table public.booking_settings
  add constraint booking_settings_total_reservable_capacity_check
  check (total_reservable_capacity > 0);

drop function if exists public.create_reservation_atomic(text, text, integer, timestamptz, text, text);

create function public.create_reservation_atomic(
  p_customer_name text,
  p_customer_email text,
  p_guest_count integer,
  p_starts_at timestamptz,
  p_special_requests text default null,
  p_language text default 'de'
)
returns table (
  reservation_reference text,
  starts_at timestamptz,
  ends_at timestamptz,
  guest_count integer
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_settings public.booking_settings%rowtype;
  v_hours public.opening_hours%rowtype;
  v_exception public.opening_exceptions%rowtype;
  v_start_local timestamp;
  v_today date;
  v_max_date date;
  v_weekday smallint;
  v_start_minutes integer;
  v_open_minutes integer;
  v_close_minutes integer;
  v_end timestamptz;
  v_reserved_guests integer;
begin
  if btrim(coalesce(p_customer_name, '')) = ''
     or char_length(btrim(p_customer_name)) > 160 then
    raise exception 'Invalid customer name';
  end if;

  if btrim(coalesce(p_customer_email, '')) = ''
     or char_length(btrim(p_customer_email)) > 320 then
    raise exception 'Invalid customer email';
  end if;

  if p_guest_count is null or p_guest_count < 1 then
    raise exception 'Invalid guest count';
  end if;

  if p_language is null or p_language not in ('de', 'en') then
    raise exception 'Invalid language';
  end if;

  select * into v_settings
  from public.booking_settings
  where id = 'default';
  if not found then
    raise exception 'Booking settings are unavailable';
  end if;

  if p_guest_count > v_settings.max_online_guests then
    raise exception 'Guest count exceeds online reservation limit';
  end if;

  v_start_local := p_starts_at at time zone v_settings.time_zone;
  v_today := (now() at time zone v_settings.time_zone)::date;
  v_max_date := (v_today + make_interval(months => v_settings.advance_booking_months))::date;
  v_weekday := extract(isodow from v_start_local::date)::smallint;
  v_start_minutes := extract(hour from v_start_local)::integer * 60
    + extract(minute from v_start_local)::integer;

  if v_start_local::date < v_today or v_start_local::date > v_max_date then
    raise exception 'Date is outside the booking window';
  end if;
  if p_starts_at <= now() then
    raise exception 'Reservation time is in the past';
  end if;

  select * into v_hours
  from public.opening_hours
  where weekday = v_weekday;
  if not found or v_hours.is_closed then
    raise exception 'The café is closed on this date';
  end if;

  select * into v_exception
  from public.opening_exceptions
  where exception_date = v_start_local::date;
  if found and v_exception.is_closed then
    raise exception 'The café is closed on this date';
  end if;

  v_open_minutes := extract(hour from coalesce(v_exception.opens_at, v_hours.opens_at))::integer * 60
    + extract(minute from coalesce(v_exception.opens_at, v_hours.opens_at))::integer;
  v_close_minutes := extract(hour from coalesce(v_exception.closes_at, v_hours.closes_at))::integer * 60
    + extract(minute from coalesce(v_exception.closes_at, v_hours.closes_at))::integer;
  v_end := p_starts_at + make_interval(mins => v_settings.reservation_duration_minutes);

  if v_start_minutes < v_open_minutes
     or v_start_minutes + v_settings.reservation_duration_minutes > v_close_minutes
     or v_start_minutes < extract(hour from v_settings.first_reservation_time)::integer * 60
       + extract(minute from v_settings.first_reservation_time)::integer
     or v_start_minutes > extract(hour from v_settings.last_reservation_time)::integer * 60
       + extract(minute from v_settings.last_reservation_time)::integer
     or mod(
       v_start_minutes - (extract(hour from v_settings.first_reservation_time)::integer * 60
         + extract(minute from v_settings.first_reservation_time)::integer),
       v_settings.booking_interval_minutes
     ) <> 0 then
    raise exception 'Reservation time is not an available booking slot';
  end if;

  perform pg_advisory_xact_lock(hashtextextended('altstadtliebe-reservation-booking', 0));

  select coalesce(sum(guest_count), 0)::integer into v_reserved_guests
  from public.reservations
  where status in ('pending', 'confirmed')
    and starts_at < v_end
    and ends_at > p_starts_at;

  if v_reserved_guests + p_guest_count > v_settings.total_reservable_capacity then
    raise exception 'RESERVATION_FULL: guest capacity reached';
  end if;

  insert into public.reservations (
    customer_name, customer_email, guest_count, starts_at, ends_at, special_requests, language
  ) values (
    btrim(p_customer_name), lower(btrim(p_customer_email)), p_guest_count,
    p_starts_at, v_end, nullif(btrim(p_special_requests), ''), p_language
  )
  returning reservations.reservation_reference, reservations.starts_at,
    reservations.ends_at, reservations.guest_count
  into reservation_reference, starts_at, ends_at, guest_count;

  return next;
end;
$$;

revoke all on function public.create_reservation_atomic(text, text, integer, timestamptz, text, text)
  from public, anon, authenticated;
grant execute on function public.create_reservation_atomic(text, text, integer, timestamptz, text, text)
  to service_role;
