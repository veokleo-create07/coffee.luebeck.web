# Altstadtliebe GDPR operations record

Last reviewed: 18 November 2026

This internal record supports the public privacy notice. It must be reviewed whenever a provider, data field, purpose, or retention period changes. Do not store customer records or staff credentials in this file.

## Processing activities

| Activity | Data | Purpose and legal basis | Recipients | Retention |
| --- | --- | --- | --- | --- |
| Website delivery | IP address, request time, requested path, browser and connection data | Secure website delivery; Art. 6(1)(f) GDPR | Vercel and infrastructure subprocessors | Provider/account security-log configuration; delete when no longer needed for operation, security, or legal documentation |
| Table reservations | Name, email, date/time, guest count, optional requests, language, status | Create and administer a reservation; Art. 6(1)(b) GDPR | Authorised Altstadtliebe staff, Supabase, Vercel | 30 days after the reservation, except where a documented legal need requires longer storage. **Automated deletion remains to be implemented.** |
| Transactional email | Name, email, reservation details, delivery metadata | Confirmation and cancellation communication; Art. 6(1)(b) GDPR | Resend and subprocessors | Resend standard-plan email and log data: 30 days; backups: 7 days, according to Resend's published GDPR information |
| Internal reservation notification | Name, reservation time, guest count, reservation reference | Prompt internal handling; Art. 6(1)(b) and Art. 6(1)(f) GDPR | Authorised staff devices and the relevant browser/device push service | Notification lifecycle on the staff device; invalid push subscriptions are removed when rejected by the push service |
| Language preference | `de` or `en` in browser local storage | Provide the language selected by the visitor; § 25(2) no. 2 TDDDG | Stored only in the visitor's browser | Until overwritten or removed through browser settings |

No customer marketing or behavioural analytics is currently performed.

## Access and security controls

- Reservation and service-role credentials are server-only.
- Supabase Row Level Security is enabled and public database-table access is revoked.
- Dashboard access is limited to authorised staff who need reservation access.
- Staff access must be removed immediately when no longer required.
- Reservation-management links are signed with a dedicated secret and expire at the reservation start time. Legacy links are accepted only until their reservation starts.
- HTTPS/HSTS, no-store reservation responses, clickjacking protection, MIME-sniffing protection, a restrictive permissions policy, and a strict referrer policy are enabled.
- Credentials must be rotated after suspected disclosure and must never be stored in source control or chat.

Maintain the actual staff-access list in a private company record, not in this repository. Record the staff member, access granted, approval, review date, and access-removal date.

## Data-subject requests

Requests sent to `team@altstadtliebe.com` must be logged privately with the received date, verified identity, requested action, decision, completion date, and responder. Respond without undue delay and normally within one month. Collect only the information needed to verify the requester.

## Personal-data breach procedure

1. Preserve evidence and immediately restrict affected access without deleting relevant logs.
2. Identify the data, people, systems, timeframe, and likely consequences involved.
3. Rotate exposed credentials and contain the incident.
4. Record the facts, impact assessment, containment, and decision even if no authority notification is required.
5. Notify the Schleswig-Holstein supervisory authority without undue delay and, where feasible, within 72 hours when the breach is likely to risk individuals' rights and freedoms.
6. Notify affected individuals without undue delay when a high risk is likely.

## Provider checks

The business owner confirmed the following on 18 November 2026:

- Supabase production is hosted in Frankfurt (`eu-central-1`), and the applicable Supabase service terms, DPA, and SCC provisions are accepted through the account.
- Vercel is on the Pro plan. The applicable Vercel service terms and DPA coverage are accepted through the account.
- Resend's applicable service terms, DPA, and international-transfer provisions are accepted through the account.

The current provider terms are linked from the public privacy policy. Review each provider's subprocessor and transfer-term changes when notified.

## Open item

- Implement and verify deletion of ordinary reservation records 30 days after the reservation date, including an appropriate approach for backups and documented legal holds.
