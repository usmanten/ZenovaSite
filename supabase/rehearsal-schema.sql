-- Minimal schema for rehearsing this fix on a throwaway Supabase project before
-- touching production. Recreates only the columns the inventory-counter-drift fix
-- actually touches — NOT a full schema dump of the real `orders`/`inventory` tables
-- (those have more columns in production; this is just enough to test against).
--
-- Usage: create a free Supabase project, run this file in its SQL editor, then run
-- manual_adjustment_strips.sql, idx_orders_not_refunded.sql, and get_claimed_packs.sql
-- against it, and point a local .env.local at this throwaway project's URL/service
-- role key to test the updated app code end-to-end before applying anything to prod.

create table if not exists inventory (
    id integer primary key,
    orders_placed integer not null default 0,
    max_orders integer not null default 100000
);

insert into inventory (id, orders_placed, max_orders)
values (1, 31, 100000)
on conflict (id) do nothing;

create table if not exists orders (
    id bigint generated always as identity primary key,
    order_quantity integer not null,
    refunded boolean not null default false,
    stripe_session_id text unique,
    stripe_payment_intent text
);

-- A few sample rows to sanity-check get_claimed_packs() against once it's created.
insert into orders (order_quantity, refunded, stripe_session_id) values
    (1, false, 'test_session_1'),
    (2, false, 'test_session_2'),
    (1, true,  'test_session_refunded');
