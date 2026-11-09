-- Question reports: a student flags a question that looks wrong or broken.
-- Run in the Supabase SQL Editor. Safe to run again.
--
-- No foreign key on question_id: past-paper ids (e.g. em-2024-q01) are built in
-- the app bundle by src/lib/past-papers.ts and are not rows in questions, so a
-- key would reject reports on exactly the questions most likely to be wrong.

create table if not exists public.question_reports (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  question_id text not null,
  reason text not null check (reason in ('wrong_answer_key', 'bad_image', 'wrong_video', 'other')),
  note text null check (note is null or char_length(note) <= 300),
  status text not null default 'open' check (status in ('open', 'fixed', 'dismissed')),
  created_at timestamptz not null default now(),
  -- One student cannot send the same reason for the same question twice.
  constraint question_reports_user_question_reason_key
    unique (user_id, question_id, reason)
);

create index if not exists question_reports_question_id_idx
  on public.question_reports (question_id);

create index if not exists question_reports_status_created_at_idx
  on public.question_reports (status, created_at);

alter table public.question_reports enable row level security;

drop policy if exists "question_reports: insert own" on public.question_reports;
create policy "question_reports: insert own"
  on public.question_reports
  for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "question_reports: select own" on public.question_reports;
create policy "question_reports: select own"
  on public.question_reports
  for select
  to authenticated
  using (user_id = auth.uid());
