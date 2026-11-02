# Altstadtliebe final launch report

Date: 2026-11-02
Verdict: **NOT READY for an unqualified production launch**

The application builds cleanly and the source audit found no broken imports or debug statements in the client code. However, browser/device coverage, live Supabase concurrency tests, and Resend delivery tests could not be completed in this environment. Those are release gates for the reservation flow.

## Scope and confirmed findings

### Fixed in this audit

- Added deployable `robots.txt` and `sitemap.xml` routes covering German and English public pages.
- Added a `CafeOrCoffeeShop` JSON-LD block to the localized homepage with address, opening hours, phone, and social profiles.
- Added `metadataBase` and a configurable `NEXT_PUBLIC_SITE_URL`.
- Made the reservation atomic RPC part of version-controlled Supabase migrations instead of leaving it only in a manual SQL file.
- Added `total_reservable_capacity` to booking settings and enforced overlapping guest capacity while holding a transaction advisory lock. This protects the last-table race at the database boundary.
- Added capacity errors to the API conflict classification.
- Removed the obsolete manual table-management SQL file that could overwrite the atomic booking logic.
- Removed four confirmed unreferenced `reveal-*` image assets.
- Updated Supabase documentation and README to match the actual API-backed reservation implementation.

### Confirmed remaining issues / release gates

- No isolated Supabase staging project or test credentials are available in the checkout. No fake reservations, cleanup, cancellation, overbooking, table-capacity, or concurrent-booking tests were run against any database.
- No Resend integration is present in the repository. Reservation email delivery was not testable and must be implemented or verified through the production integration before launch.
- There is no Playwright dependency or browser test suite in the repository. The sandbox also blocks starting a local Next server with `EPERM`, so responsive screenshots and real interaction tests were not captured.
- `npm audit` could not reach the npm registry because network/DNS access was unavailable; dependency vulnerability status remains unverified.
- Real iPhone Safari, Android, iPad Safari, trackpad, and touch testing remains outstanding. The matcha videos and scroll synchronization were not changed in this audit.

## Checks actually run

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed; 19 routes generated, including `/robots.txt` and `/sitemap.xml` |
| `git diff --check` | Passed |
| `npm audit --omit=dev --audit-level=high` | Not completed; registry DNS unavailable |
| Playwright/browser tests | Not run; Playwright is not installed |
| Local responsive browser test | Blocked; server listen returned `EPERM` |
| Supabase end-to-end tests | Not run; no isolated staging credentials |
| Resend email delivery | Not run; no Resend implementation/configuration present |

## Requested viewport coverage

The following viewports were not visually exercised in a browser during this audit: 320, 375, 390, 430, 768, 1024, 1440, and 1920 CSS pixels. No screenshot locations can be reported because browser capture was unavailable.

## Files changed

- `.env.example`
- `README.md`
- `FINAL-LAUNCH-REPORT.md`
- `app/api/reservations/route.ts`
- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `components/home-shell.tsx`
- `docs/supabase.md`
- `supabase/migrations/20261102000000_reservation_atomic_booking.sql`
- Deleted obsolete `supabase/manual/remove-table-management.sql`
- Deleted four unreferenced `public/reveal-*.jpeg` assets

## Launch checklist before changing the verdict

1. Configure a disposable Supabase staging project and apply every migration.
2. Run API tests for valid/invalid input, Monday closure, past dates/times, six-guest maximum, 90-minute duration, opening exceptions, capacity limits, cancellation states, and two concurrent requests for the final capacity.
3. Add and verify the intended Resend confirmation/cancellation workflow without sending to real customers.
4. Install/configure Playwright and capture all requested desktop, tablet, and mobile screenshots.
5. Test the hero and reservation picker on physical iPhone Safari and iPad Safari.
6. Re-run `npm audit` with registry access and review the production environment variables and deployment headers.

## Git

Commit and push status: pending until the remaining checks in this report are addressed or explicitly accepted as release limitations.
