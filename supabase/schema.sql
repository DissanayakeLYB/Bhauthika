-- Bhauthika database schema.
-- Run this first in the Supabase SQL Editor, then run seed.sql.

create table if not exists public.questions (
  id text primary key,
  exam_year int not null,
  question_number int not null,
  topic_id text not null,
  question_text text not null,
  options jsonb not null,
  correct_index int not null,
  formula_hint text null,
  derivation jsonb null,
  diagram_url text null,
  video_url text null,
  -- Extra fields used by the app's Question type.
  paper text null,
  diagram_type text null,
  created_at timestamptz default now(),
  constraint questions_options_is_array check (jsonb_typeof(options) = 'array')
);

create table if not exists public.attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id),
  question_id text not null references public.questions (id),
  selected_index int not null,
  is_correct boolean not null,
  created_at timestamptz default now()
);

create index if not exists attempts_user_id_created_at_idx
  on public.attempts (user_id, created_at);

-- Row Level Security -------------------------------------------------------
-- Supabase grants new public tables to authenticated by default; make the
-- app's permissions explicit so they do not depend on project settings.
grant select on public.questions to authenticated;
grant select, insert on public.attempts to authenticated;

alter table public.questions enable row level security;
alter table public.attempts enable row level security;

-- Questions are read-only for signed-in students. There are no insert,
-- update or delete policies, so the app cannot change the question bank.
drop policy if exists "Signed-in users can read questions" on public.questions;
create policy "Signed-in users can read questions"
  on public.questions
  for select
  to authenticated
  using (true);

-- Attempts are private to the student who made them.
drop policy if exists "Users can read their own attempts" on public.attempts;
create policy "Users can read their own attempts"
  on public.attempts
  for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users can insert their own attempts" on public.attempts;
create policy "Users can insert their own attempts"
  on public.attempts
  for insert
  to authenticated
  with check (user_id = auth.uid());
