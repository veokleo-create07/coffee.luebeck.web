-- Simplify the transactional email outbox to confirmations and cancellations.
-- Reminders and cron-only scheduling are intentionally removed.

delete from public.reservation_email_jobs where kind = 'reminder';

alter table public.reservation_email_jobs
  drop constraint if exists reservation_email_jobs_kind_check,
  drop constraint if exists reservation_email_jobs_status_check;

alter table public.reservation_email_jobs
  drop column if exists scheduled_for;

alter table public.reservation_email_jobs
  add constraint reservation_email_jobs_kind_check
    check (kind in ('confirmation', 'cancellation')),
  add constraint reservation_email_jobs_status_check
    check (status in ('pending', 'processing', 'sent', 'failed'));

drop trigger if exists enqueue_reservation_email_jobs on public.reservations;
drop function if exists public.enqueue_reservation_email_jobs();

create or replace function public.enqueue_reservation_email_jobs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.reservation_email_jobs (reservation_id, kind, idempotency_key)
    values (new.id, 'confirmation', 'reservation:' || new.id::text || ':confirmation')
    on conflict (reservation_id, kind) do nothing;
  elsif tg_op = 'UPDATE'
    and new.status = 'cancelled'
    and old.status is distinct from 'cancelled' then
    insert into public.reservation_email_jobs (reservation_id, kind, idempotency_key)
    values (new.id, 'cancellation', 'reservation:' || new.id::text || ':cancellation')
    on conflict (reservation_id, kind) do nothing;
  end if;

  return new;
end;
$$;

create trigger enqueue_reservation_email_jobs
  after insert or update of status on public.reservations
  for each row execute function public.enqueue_reservation_email_jobs();

drop function if exists public.claim_reservation_email_jobs(integer);

create or replace function public.claim_reservation_email_jobs(p_limit integer default 10)
returns table (
  job_id uuid,
  reservation_id uuid,
  kind text,
  idempotency_key text,
  attempt_count integer,
  customer_name text,
  customer_email text,
  guest_count integer,
  starts_at timestamptz,
  ends_at timestamptz,
  special_requests text,
  status text,
  language text
)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.reservation_email_jobs
  set status = 'pending', locked_at = null
  where status = 'processing' and locked_at < timezone('utc', now()) - interval '10 minutes';

  return query
  with candidates as (
    select j.id
    from public.reservation_email_jobs j
    where j.status = 'pending'
      and j.next_attempt_at <= timezone('utc', now())
    order by j.created_at
    for update skip locked
    limit greatest(1, least(coalesce(p_limit, 10), 50))
  ), claimed as (
    update public.reservation_email_jobs j
    set status = 'processing', locked_at = timezone('utc', now()), attempt_count = j.attempt_count + 1
    from candidates c
    where j.id = c.id
    returning j.*
  )
  select c.id, r.id, c.kind, c.idempotency_key, c.attempt_count,
    r.customer_name, r.customer_email, r.guest_count, r.starts_at, r.ends_at,
    r.special_requests, r.status, r.language
  from claimed c
  join public.reservations r on r.id = c.reservation_id;
end;
$$;
