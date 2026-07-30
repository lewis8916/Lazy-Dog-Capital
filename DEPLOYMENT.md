# Deployment & Operations

Everything here was verified on **2026-07-30**. If something behaves oddly, check
this file before re-diagnosing from scratch — most of it was learned the hard way.

## Where things live

| | |
|---|---|
| Live site | https://lazydogcapital.com |
| Repo | `github.com/lewis8916/Lazy-Dog-Capital`, branch `main` |
| Host | Hostinger (hPanel), Node.js web app |
| Node version | 22.x |
| Framework | Next.js 14 (App Router), root directory `./` |
| Domain registrar + DNS | Cloudflare (nameservers `aragorn`/`leia.ns.cloudflare.com`) |

The old temporary domain `lightgray-jackal-705774.hostingersite.com` was retired
when the real domain was attached. It now returns 403 — that is expected.

## Deploying

Push to `main`. Hostinger auto-deploys. A full build takes about **2m20s**;
assets typically go live within a minute of the build finishing.

```bash
git push origin main
```

Verify a deploy landed by requesting a page with a cache-buster — Hostinger's CDN
will happily serve stale content for hours and make a dead app look healthy:

```bash
curl -sI "https://lazydogcapital.com/?bust=1" | grep -iE "^HTTP|x-powered-by"
```

`x-powered-by: Next.js` means the Node app answered. If pages return 200 but
lack that header, you are seeing cached responses from a **dead origin**.

## ⚠️ Environment variables need a rebuild from the right screen

Saving env vars in hPanel is **not enough**, and **a git push does not inject
them either**. A full fresh git build ran with the variables saved and the
process still could not see them.

What works:

**Deployments → Settings & Redeploy → Environment variables → Save → rebuild
from that screen.**

Current variables (all five API routes read the same three):

| Name | Value |
|---|---|
| `RESEND_API_KEY` | Resend API key, sending access |
| `APPLICATION_TO_EMAIL` | `lewis@mcknight.com` |
| `APPLICATION_FROM_EMAIL` | `onboarding@resend.dev` |

Fallback if the panel ever fails again: create `.env.local` in the `nodejs/`
folder via File Manager (`KEY=value`, one per line). Next.js loads it at startup,
and `.gitignore` already excludes `.env*.local`.

## ⚠️ Do not reference `public/` by URL

Hostinger splits the site across `nodejs/` (the app) and `public_html/`
(LiteSpeed's document root). Static file requests hit `public_html/` first, so
assets in `nodejs/public/` were returning LiteSpeed 404s while
`/_next/static/*` worked fine.

Import assets instead of referencing them by path:

```jsx
import logo from "@/public/logo_icon.png";
<img src={logo.src} alt="Lazy Dog Capital" />
```

Next emits them to `/_next/static/media/` with a content hash, which is served by
the Node app and survives every redeploy. The favicon lives at `app/icon.png`
for the same reason — App Router serves it through Node.

Later the same day the raw `/logo_*.png` paths began returning 200 and the cause
was never pinned down. Treat URL-referencing as unreliable here, not merely
broken; the import approach works either way.

## ⚠️ Do not use `next/image`

`sharp` is not installed, and every build warns about it. Production image
optimization would be broken. Static imports with plain `<img>` are the
supported path on this host. If you ever want `next/image`, add `sharp` to
`package.json` first and confirm the build still passes.

## Email

All five forms — `/api/apply`, `/api/contact`, `/api/submit-deal`,
`/api/draw-request`, `/api/payoff-request` — deliver through Resend. Draw and
payoff share `lib/sendRequest.js`.

Every route sends **only to `APPLICATION_TO_EMAIL`**, with the submitter's
address as `replyTo`. The site never emails borrowers.

**Current limitation:** the sender is `onboarding@resend.dev`, Resend's shared
test address, which only delivers to the Resend account owner. Adding a second
address to `APPLICATION_TO_EMAIL` will **silently fail** for that recipient.

Fixing that means verifying `lazydogcapital.com` in Resend — but the account
already has another domain on it, and a second domain requires the $20/month
plan. Not worth it until borrower-facing email exists or a second recipient is
genuinely needed. No mailbox is required to send from a verified domain; it is a
sending identity, not an inbox.

### The silent failure mode

If `RESEND_API_KEY` or `APPLICATION_TO_EMAIL` is missing, the routes return:

```json
{"ok": true, "emailed": false}
```

HTTP **200**. The borrower sees a success message and the submission is
discarded. Never assume email works — test it:

```bash
curl -s -X POST -H "Content-Type: application/json" \
  -d '{"name":"test","phone":"555","email":"you@example.com","message":"test"}' \
  https://lazydogcapital.com/api/contact
```

`"emailed":true` is the only proof. A `502` means the key loaded but Resend
rejected it — which is different, and better, than `emailed:false`.

## Form spam protection

`lib/spamGuard.js` runs on all five endpoints before validation.

**Rate limiting is the real protection.** 10 submissions per IP per 10 minutes
across all forms, keyed on `cf-connecting-ip` (verified present — Cloudflare
fronts the site). In-memory, so it resets on every redeploy.

It **fails open**: if no header identifies the caller, the limit is skipped
rather than falling back to a shared key. An earlier version used the string
`"unknown"` as a fallback, which would have keyed every visitor to one bucket
and locked out the whole site at once.

**The honeypot logs but does not block.** It originally returned a fake success
when the hidden `ldc_hp` field was filled — and silently discarded a real
contact submission, because a password manager populated the field despite the
deliberately odd name, `autocomplete="off"` and `tabIndex={-1}`. The sender saw
a success message and nothing arrived.

> Do not make the honeypot blocking again without a mechanism autofill cannot
> trigger. A hidden **checkbox** is the safe version — password managers do not
> tick checkboxes, but naive form-filling bots do. Losing one loan application
> costs far more than the spam a honeypot prevents.

### Testing note

`curl` from a machine on the same network as the site owner **shares their IP**,
so test traffic consumes the owner's rate-limit allowance. This looked like a
shared-bucket bug once and was not. Redeploying clears the counter.

Direct API calls also **do not send the honeypot field**, so they cannot
reproduce browser-only failures. Verify form changes from a real browser.

## Outstanding

- **`next@14.2.5` has a known security vulnerability** (flagged in every build
  log, plus 9 high / 1 critical npm advisories). This site collects names, phone
  numbers, addresses and financial details. A `14.2.x` patch bump should be low
  risk.
- **`www.lazydogcapital.com` does not resolve** (NXDOMAIN). Needs one CNAME in
  Cloudflare: name `www`, target `lazydogcapital.com`.
- Logo PNGs are oversized — `logo_icon.png` is 406 KB rendered at 48px. Resizing
  the sources would cut roughly 400 KB per page load.
