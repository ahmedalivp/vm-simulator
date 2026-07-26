-- Run this in Supabase Dashboard > SQL Editor after creating the three tables.
-- It creates the shared workspace, protects it, and enables live updates.

insert into public.workspaces (slug)
values ('vm-simulator')
on conflict (slug) do nothing;

alter table public.workspaces enable row level security;
alter table public.workspace_members enable row level security;
alter table public.task_progress enable row level security;

create or replace function public.is_workspace_member(target_workspace_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.workspace_members
    where workspace_id = target_workspace_id
      and user_id = (select auth.uid())
  );
$$;

grant execute on function public.is_workspace_member(uuid) to authenticated;

drop policy if exists "Team members can view workspace" on public.workspaces;
create policy "Team members can view workspace"
on public.workspaces for select to authenticated
using (public.is_workspace_member(id));

drop policy if exists "Team members can view members" on public.workspace_members;
create policy "Team members can view members"
on public.workspace_members for select to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists "Team members can read progress" on public.task_progress;
create policy "Team members can read progress"
on public.task_progress for select to authenticated
using (public.is_workspace_member(workspace_id));

drop policy if exists "Team members can add progress" on public.task_progress;
create policy "Team members can add progress"
on public.task_progress for insert to authenticated
with check (
  public.is_workspace_member(workspace_id)
  and updated_by = (select auth.uid())
);

drop policy if exists "Team members can change progress" on public.task_progress;
create policy "Team members can change progress"
on public.task_progress for update to authenticated
using (public.is_workspace_member(workspace_id))
with check (
  public.is_workspace_member(workspace_id)
  and updated_by = (select auth.uid())
);

do $$
begin
  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'task_progress'
  ) then
    alter publication supabase_realtime add table public.task_progress;
  end if;
end;
$$;

-- After each teammate creates an account, run this query once and replace emails.
-- insert into public.workspace_members (workspace_id, user_id, role)
-- select w.id, u.id, 'member'
-- from public.workspaces w
-- join auth.users u on lower(u.email) in (
--   'ahmed@example.com', 'basu@example.com', 'ijaz@example.com', 'ammar@example.com'
-- )
-- where w.slug = 'vm-simulator'
-- on conflict (workspace_id, user_id) do nothing;
