# Altstadtliebe final launch report

Date: 2026-11-02
Verdict: **NOT READY for an unqualified production launch**

The application passes the available static checks and the automated browser matrix. The reservation UI and Monday-closure behavior were exercised locally without a database. A disposable Supabase staging project is not configured in this checkout, so database-backed reservation, concurrency, cancellation, and capacity tests remain release blockers. Resend was intentionally excluded from this audit as requested.

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
- Added request-aware locale handling so explicit `/en/*` pages render `lang="en"` while German pages render `lang="de"`.
- Added a repeatable Playwright audit script and captured responsive screenshots under `test-results/launch-audit/`.
- Updated Next.js to patched `15.5.28` and pinned the vulnerable transitive PostCSS dependency to patched `8.5.29` using a package override.
- Added a reproducible disposable Supabase staging setup guide with isolated environment variables and cleanup instructions.
- Added a transactional reservation email outbox, Resend worker, bilingual branded templates, cancellation trigger, retry handling, and Vercel cron configuration. No live email was sent during this implementation pass.

### Confirmed remaining issues / release gates

- No isolated Supabase staging project or test credentials are available in the checkout. No fake reservations, cleanup, cancellation, overbooking, table-capacity, or concurrent-booking tests were run against any database.
- Resend delivery was not live-verified in this scope; implementation is present but intentionally has not sent email.
- Physical iPhone Safari, Android, iPad Safari, trackpad, and touch testing remain outstanding. The automated browser run used headless Chromium.
- The production dependency audit is now clean at high severity after the targeted Next.js/PostCSS update. Fourteen moderate development/transitive advisories remain in the full audit output and require separate dependency review.
- The matcha videos and scroll synchronization were not changed in this audit.
- Resend delivery is implemented but remains unverified until the Resend domain, API key, Supabase migration, and staging data are configured.

## Checks actually run

| Check | Result |
|---|---|
| `npm run lint` | Passed |
| `npx tsc --noEmit` | Passed |
| `npm run build` | Passed; 19 routes generated, including `/robots.txt` and `/sitemap.xml` |
| `git diff --check` | Passed |
| `npm audit --omit=dev --audit-level=high` | Passed: 0 high/critical vulnerabilities after Next.js 15.5.28 and PostCSS 8.5.29 override |
| Playwright route/viewport matrix | PARTIAL: 96 page responses were HTTP 200 with no horizontal overflow; reservation pages emitted availability `500` responses because staging Supabase credentials are absent |
| Playwright interaction checks | PARTIAL: menu links, FAQ expansion, English reservation entry, and Monday closure UI passed; console errors were caused by the same missing Supabase availability configuration |
| Local responsive browser screenshots | Captured under `test-results/launch-audit/` at 390, 768, and 1440px for homepage, FAQ, and reservation states; reservation screenshots are UI-only without live availability |
| Supabase end-to-end tests | Not run; no isolated staging credentials |
| Resend email delivery | NOT TESTED live; requires verified Resend domain, API key, staging queue, and fake recipient |
| Resend integration implementation | Implemented; local worker safety checks returned 401 without cron auth and 503 without provider configuration; no email was sent |

The full `npm audit` still reports 14 moderate advisories in development/transitive dependencies. They were not force-upgraded because doing so would introduce unrelated dependency changes.

## Requested viewport coverage

The automated matrix exercised all requested CSS widths: 320, 375, 390, 430, 768, 1024, 1440, and 1920. All page navigations returned HTTP 200 and no horizontal overflow was reported. Reservation pages made availability requests and received HTTP 500 because this checkout has no Supabase staging environment variables; this is recorded as a test limitation, not a passed reservation integration. Full-page screenshots were captured for the main homepage, FAQ, and reservation routes at 390, 768, and 1440px. The root `/` route redirects to English in this browser because the existing locale-selection behavior detects an English browser language; explicit German routes were verified separately.

### Reservation test status

| Scenario | Result | Evidence / limitation |
|---|---|---|
| Reservation UI opens at mobile and desktop widths | PASS (UI-only) | Playwright found the date field and exercised the reservation route at 390, 768, and 1440px |
| Monday closure message | PASS (UI-only) | English message verified after selecting `2026-11-02`; no availability request is made for the closed day |
| German Monday closure copy | NOT TESTED in browser | The localized copy exists in the dictionary; no separate browser assertion was added in this run |
| Date/time/guest selection against real availability | NOT TESTED | No isolated Supabase staging credentials are configured |
| Past dates/times, 09:00–17:00 window, 30-minute intervals, 90-minute duration | NOT TESTED end-to-end | Requires staging data and server timezone validation |
| Six-guest limit and larger-party fallback | NOT TESTED end-to-end | Requires API/database execution |
| Fully booked capacity and table availability | NOT TESTED | Requires disposable staging records |
| Concurrent last-capacity bookings / overbooking | NOT TESTED | Requires two isolated concurrent API requests against staging |
| Reservation status, cancellation, cleanup | NOT TESTED | Requires staging access and cancellation test fixtures |
| Successful booking screenshot | NOT CAPTURED | Production/staging credentials are absent; no fake booking was created |
| Fully booked/unavailable screenshot | NOT CAPTURED | No staging availability data was used |
| Resend confirmation/cancellation email | NOT TESTED by instruction | Email automation is intentionally postponed |

### Browser audit artifacts

- Script: `scripts/launch-audit.mjs`
- Results: `test-results/launch-audit/results.json`
- Screenshots: `test-results/launch-audit/*.png`
- Local command: `node scripts/launch-audit.mjs`
- Browser setup used for this run: temporary `@playwright/test` install plus Chromium; the dependency was not added to `package.json`.

## Files changed

- `.env.example`
- `README.md`
- `FINAL-LAUNCH-REPORT.md`
- `app/api/reservations/route.ts`
- `app/layout.tsx`
- `app/robots.ts`
- `app/sitemap.ts`
- `components/home-shell.tsx`
- `middleware.ts`
- `scripts/launch-audit.mjs`
- `test-results/launch-audit/` (browser results and screenshots)
- `docs/supabase-staging.md`
- `supabase/migrations/20261103000000_reservation_email_outbox.sql`
- `app/api/email/process/route.ts`
- `lib/email/reservation-email.ts`
- `vercel.json`
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
6. Review the remaining moderate development/transitive advisories when making the next dependency maintenance pass.
7. Review the production environment variables and deployment headers.
8. Configure and verify Resend domain/API settings, apply the email-outbox migration in staging, and test confirmation, cancellation, and reminder delivery with fake recipients before enabling production sending.

## Git

Commit and push status: local changes are not pushed. Production push is intentionally withheld pending review and the remaining reservation/security release gates.
