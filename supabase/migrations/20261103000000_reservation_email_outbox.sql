-- Transactional email outbox for confirmations, cancellations, and reminders.
-- The worker sends jobs through Resend; database triggers make this independent
-- of which trusted dashboard process changes a reservation status.

create table if not exists public.reservation_email_jobs (
  id uuid primary key default gen_random_uuid(),
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  kind text not null check (kind in ('confirmation', 'cancellation', 'reminder')),
  idempotency_key text not null unique,
  scheduled_for timestamptz not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'sent', 'failed', 'cancelled')),
  attempt_count integer not null default 0 check (attempt_count >= 0),
  next_attempt_at timestamptz not null default timezone('utc', now()),
  locked_at timestamptz,
  sent_at timestamptz,
  provider_message_id text,
  last_error text,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique (reservation_id, kind)
);

create index if not exists reservation_email_jobs_ready_idx
  on public.reservation_email_jobs (status, next_attempt_at, scheduled_for);
create index if not exists reservation_email_jobs_reservation_idx
  on public.reservation_email_jobs (reservation_id);

drop trigger if exists set_reservation_email_jobs_updated_at on public.reservation_email_jobs;
create trigger set_reservation_email_jobs_updated_at
  before update on public.reservation_email_jobs
  for each row execute function public.set_updated_at();

create or replace function public.enqueue_reservation_email_jobs()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if tg_op = 'INSERT' then
    insert into public.reservation_email_jobs (reservation_id, kind, idempotency_key, scheduled_for)
    values
      (new.id, 'confirmation', 'reservation:' || new.id::text || ':confirmation', timezone('utc', now())),
      (new.id, 'reminder', 'reservation:' || new.id::text || ':reminder', greatest(timezone('utc', now()), new.starts_at - interval '24 hours'))
    on conflict (reservation_id, kind) do nothing;
  elsif tg_op = 'UPDATE' then
    if new.starts_at is distinct from old.starts_at then
      update public.reservation_email_jobs
      set scheduled_for = greatest(timezone('utc', now()), new.starts_at - interval '24 hours'),
          next_attempt_at = greatest(timezone('utc', now()), new.starts_at - interval '24 hours'),
          status = case when status = 'sent' then status else 'pending' end,
          locked_at = null
      where reservation_id = new.id and kind = 'reminder' and status not in ('sent', 'cancelled');
    end if;

    if new.status = 'cancelled' and old.status is distinct from 'cancelled' then
      update public.reservation_email_jobs
      set status = 'cancelled', locked_at = null
      where reservation_id = new.id and kind = 'reminder' and status in ('pending', 'processing');

      insert into public.reservation_email_jobs (reservation_id, kind, idempotency_key, scheduled_for)
      values (new.id, 'cancellation', 'reservation:' || new.id::text || ':cancellation', timezone('utc', now()))
      on conflict (reservation_id, kind) do nothing;
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enqueue_reservation_email_jobs on public.reservations;
create trigger enqueue_reservation_email_jobs
  after insert or update of status, starts_at on public.reservations
  for each row execute function public.enqueue_reservation_email_jobs();

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
      and j.scheduled_for <= timezone('utc', now())
    order by j.scheduled_for, j.created_at
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

create or replace function public.complete_reservation_email_job(p_job_id uuid, p_provider_message_id text default null)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reservation_email_jobs
  set status = 'sent', sent_at = timezone('utc', now()), locked_at = null,
      provider_message_id = p_provider_message_id, last_error = null
  where id = p_job_id and status = 'processing';
$$;

create or replace function public.fail_reservation_email_job(p_job_id uuid, p_error text)
returns void
language sql
security definer
set search_path = public
as $$
  update public.reservation_email_jobs
  set status = case when attempt_count >= 5 then 'failed' else 'pending' end,
      next_attempt_at = timezone('utc', now()) + make_interval(mins => least(60, greatest(1, power(2, attempt_count)::integer))),
      locked_at = null, last_error = left(coalesce(p_error, 'Email delivery failed.'), 1000)
  where id = p_job_id and status = 'processing';
$$;

alter table public.reservation_email_jobs enable row level security;
revoke all on table public.reservation_email_jobs from anon, authenticated;
revoke all on function public.enqueue_reservation_email_jobs() from public, anon, authenticated;
revoke all on function public.claim_reservation_email_jobs(integer) from public, anon, authenticated;
revoke all on function public.complete_reservation_email_job(uuid, text) from public, anon, authenticated;
revoke all on function public.fail_reservation_email_job(uuid, text) from public, anon, authenticated;
grant execute on function public.claim_reservation_email_jobs(integer) to service_role;
grant execute on function public.complete_reservation_email_job(uuid, text) to service_role;
grant execute on function public.fail_reservation_email_job(uuid, text) to service_role;
