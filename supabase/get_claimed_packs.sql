-- NEW function. Source of truth for "how many packs have been claimed," derived
-- live from the orders table instead of a separately-maintained counter.
--
-- Returns raw PACKS, not strips, on purpose — STRIPS_PER_PACK stays single-sourced
-- in lib/strips-inventory-math.ts rather than being duplicated into SQL.
--
-- Apply this AFTER manual_adjustment_strips.sql and idx_orders_not_refunded.sql.
-- Safe to run multiple times (CREATE OR REPLACE).

create or replace function get_claimed_packs()
returns bigint
language sql
stable
as $$
    select coalesce(sum(order_quantity), 0)
    from orders
    where refunded is not true;
$$;
