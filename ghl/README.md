# GHL Funnel Pages — P4P Client Acquisition Machine

Five self-contained HTML pages matching the live funnel structure:

| File | URL / GHL step | Purpose |
|---|---|---|
| `index.html` | `/` | Cold-traffic landing page |
| `pre-booking.html` | `/pre-booking` | Application — **embed GHL survey** |
| `dfy-application-payment.html` | `/dfy-application-payment` | $1 seriousness filter — **embed GHL order form** |
| `book-a-call.html` | `/book-a-call` | Booking — **embed GHL calendar** |
| `p4p-congrats.html` | `/p4p-congrats` | Post-booking — **embed pre-call video** |

Every page is fully self-contained (all CSS inline, no build step, no external deps
except Google Fonts). `shared-styles.css` + `templates/` are the source; the root
`.html` files are the finished, inlined pages.

## Positioning this funnel is built on

- **Hero avatar:** the established, *already-running* operator drowning in complexity —
  good months then bad, and every fix has meant *adding* another tool/setter/tactic.
- **Promise:** consistent high-value clients **without adding complexity** — we simplify
  and connect the pieces, and run the authority layer that lifts the whole ecosystem.
- **Enemy:** the *complexity tax* — thinking you need more, when you need it connected and simpler.
- **Mechanism:** the Client Acquisition Machine + the paid **authority layer** (celebrity-effect
  ads) that makes retargeting, follow-up and ads all convert better.
- **Differentiators:** we simplify (not stack) · the **$1 application filter** almost nobody runs ·
  you work **directly with us** (Slack + calls), not a course.
- **Proof:** real ROAS numbers (Fitness Rebirth: Sep–Nov 2025, ~12x ROAS, ~$60/qualified call).
- **Meta-safe:** no "$50k guaranteed." The $50k is framed as a **proof-of-concept milestone**.

## Offer architecture — how the money works (internal; mostly for the CALL, not the page)

The pages sell the **call**, never the price. On the call:

- **Anchor = Performance Partnership (~$15k up / $30k total, $50k milestone).** Lead with this.
  Fast cash, biggest CAC headroom, self-selects the capitalised avatar.
- **Downsell = Growth Partnership (~$1.5–2k/mo + 10% rev share).** For value-convinced buyers
  who want lower upfront risk. The rev-share *is* the risk reversal — no separate guarantee.
- **Trust-close (hold back, offer selectively) = 7-day paid pilot.** A non-refundable
  ~$1.5–2k deposit **credited toward the program** if they proceed. Deliverable = the *plan +
  a taste* (offer draft, ad/ROAS strategy, one quick-win asset), **not** the full build.
  **Do NOT advertise this on the ads or pages** — it's a call/retargeting tool only.
- **Guarantee** stays on the call, input-conditional (must fund ads + show up + approve assets).

## GHL wiring checklist

1. **Survey** (`/pre-booking`): one question per slide (name/email/phone, business type,
   monthly revenue, offer price, biggest challenge, **ad-spend readiness ~$3k/mo**,
   investment readiness, decision-maker). Conditional logic:
   - **Disqualify → "not yet" message + tag `dfy-not-qualified`** if: revenue < $5k/mo,
     "not yet" on ad spend, "no" on investment, or not a coach/consultant/expert-led/agency.
   - **Qualify → redirect to `/dfy-application-payment` + tag `dfy-qualified`.**
   - Ad-spend readiness is the **most important gate** — historically the biggest leak.
2. **Order form** (`/dfy-application-payment`): product **"Application Deposit — $1.00 USD"**
   (set currency to USD — the live page currently renders R0.00). On success → `/book-a-call`.
3. **Calendar** (`/book-a-call`): your diagnosis-call calendar. Confirmation → redirect to `/p4p-congrats`.
4. **Video** (`/p4p-congrats`): pre-call video (YouTube unlisted / Vimeo / GHL). Also embed the
   VSL in the hero of `index.html`.
5. **Meta Pixel** (site-wide in GHL): map events — `/pre-booking` view → ViewContent,
   survey submit → Lead, `/dfy-application-payment` view → AddPaymentInfo, **$1 paid → Purchase**
   (optimise ad campaigns on this), booking → Schedule.

## Before going live

- Confirm the ICP revenue floor in the survey (KB: ~$10k/mo ideal, $5k absolute floor).
- Verify the testimonials/ROAS figures render correctly and are current.
- Add the VSL and the pre-call video.
- Double-check the $1 order form currency shows **USD**.

## Using in GHL

Per page, add a full-width **Custom JS/HTML** element and paste that page's `<style>…</style>`
block plus the `<body>` content. Then replace each dashed **embed slot** with your GHL
survey / order form / calendar / video element (each slot has a comment saying exactly where
to find the code and which redirect to set).

## Editing

Edit `templates/*.html` (copy) or `shared-styles.css` (design), then rebuild:

```bash
cd ghl && node -e "const fs=require('fs');const css=fs.readFileSync('shared-styles.css','utf8');for(const f of fs.readdirSync('templates')){fs.writeFileSync(f,fs.readFileSync('templates/'+f,'utf8').replace('/*__SHARED_CSS__*/',css.trim()))}"
```
