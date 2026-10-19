# Supabase SQL

This project doesn't use the Supabase CLI or a real migrations system — the database (tables, Postgres functions/RPCs, indexes) is hand-maintained directly in the Supabase dashboard's SQL editor. These files are a **version-controlled snapshot and instruction set**, not something that gets applied automatically by any build/deploy step. Nothing in this directory runs itself — each `.sql` file is meant to be copy-pasted into the Supabase SQL editor by hand, in the order described below, and reviewed before running.

Adopting the actual Supabase CLI (`supabase db diff` / `supabase migration`) for real migration history would be a good future improvement; out of scope for now.

## Files

- `get_leaderboard.sql`, `increment_orders_placed.sql`, `decrement_orders_placed.sql` — snapshots of the three Postgres functions that existed in Supabase before the inventory-counter-drift fix. `get_leaderboard` is still in use (per the leaderboard API route). `increment_orders_placed`/`decrement_orders_placed` are **retired** as of the drift fix (see below) and kept only for reference/rollback; nothing in the app calls them anymore.
- `get_claimed_packs.sql` — new function. Returns the live count of non-refunded packs ordered, summed directly from the `orders` table. This replaces the old `inventory.orders_placed` counter as the source of truth for "how many strips have been claimed" — there's no separate counter to go out of sync anymore.
- `manual_adjustment_strips.sql` — adds a `manual_adjustment_strips` column to `inventory`. Edit this value directly in the Supabase Table Editor (`inventory` table, row `id = 1`) at any time to apply a manual correction to the public "strips remaining" numbers — e.g. accounting for strips sold offline, or a one-time recalibration. No code change or redeploy needed.
- `idx_orders_not_refunded.sql` — a supporting partial index so `get_claimed_packs()` stays cheap as the `orders` table grows.

## Apply order (new project / production)

1. `manual_adjustment_strips.sql` (additive column, default `0`, inert to old app code)
2. `idx_orders_not_refunded.sql`
3. `get_claimed_packs.sql`
4. Deploy the updated app code (see root README / PR for this change)
5. One-time data repair: seed `manual_adjustment_strips` to the correct real-world value (see the PR description / plan for the exact formula)

The old `orders_placed`/`max_orders` columns on `inventory` and the old `increment_orders_placed`/`decrement_orders_placed` functions are left in place for a rollback window after cutover rather than dropped immediately.
