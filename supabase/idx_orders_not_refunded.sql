-- Supporting partial index so get_claimed_packs() stays cheap as the orders table
-- grows. Covers (order_quantity) for non-refunded rows only, so Postgres can
-- answer the SUM via an index-only scan in the common case.
--
-- Safe to run multiple times (IF NOT EXISTS).

create index if not exists idx_orders_not_refunded_qty
on orders (order_quantity)
where refunded is not true;
