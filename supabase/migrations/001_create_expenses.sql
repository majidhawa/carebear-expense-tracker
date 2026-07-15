create table public.expenses (
  id uuid primary key default gen_random_uuid(),

  user_id uuid not null
    references auth.users(id)
    on delete cascade,

  title text not null
    check (char_length(trim(title)) between 2 and 100),

  amount numeric(12, 2) not null
    check (amount > 0),

  currency text not null
    check (currency in ('KES', 'USD', 'EUR', 'GBP')),

  category text not null
    check (
      category in (
        'Office',
        'Travel',
        'Meals',
        'Utilities',
        'Software',
        'Transport',
        'Health',
        'Other'
      )
    ),

  expense_date date not null,

  is_taxable boolean not null default false,

  created_at timestamptz not null default now(),

  updated_at timestamptz not null default now()
);

alter table public.expenses
enable row level security;

create policy "Users can view their own expenses"
on public.expenses
for select
using (auth.uid() = user_id);

create policy "Users can create their own expenses"
on public.expenses
for insert
with check (auth.uid() = user_id);

create policy "Users can update their own expenses"
on public.expenses
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own expenses"
on public.expenses
for delete
using (auth.uid() = user_id);
