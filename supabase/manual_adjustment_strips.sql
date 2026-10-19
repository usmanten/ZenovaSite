-- NEW column on `inventory`. This is the whole answer to "how do I correct the
-- public strips-remaining number without redeploying code."
--
-- Edit this value directly in the Supabase Table Editor (inventory table, row id=1)
-- at any time. It is added directly into the "claimed" total alongside the live
-- orders-table aggregate (see lib/strips-inventory-math.ts), so it can be positive
-- (e.g. account for strips sold offline, not through the website) or negative
-- (e.g. a correction the other direction). Default 0 = no adjustment.
--
-- Safe to run multiple times (IF NOT EXISTS).

alter table inventory add column if not exists manual_adjustment_strips integer not null default 0;
