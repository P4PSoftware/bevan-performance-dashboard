# P4P Done-For-You Ads Funnel

A cold-traffic funnel for the P4P DFY offer:

```
Ad click → /            (landing page)
         → /apply       (2-minute application, 7 steps)
         → /qualified   (pre-qualified → $1 refundable call deposit via Stripe)
         → /book        (Calendly — book the strategy call)
         → /not-a-fit   (polite decline + advice for unqualified applicants)
```

## Qualification rules

An applicant reaches the $1 payment page only if ALL of these hold
(see `src/funnel/application.ts` → `isQualified`):

1. They are a **coach, consultant or agency owner** (not "something else"), and
2. They make **$5k+/month** — or $2–5k/month AND selected
   "ready to invest now" (the "rising star" exception), and
3. They did **not** answer "No — I'm not in a position to invest".

Everyone else lands on `/not-a-fit` with honest advice and an invitation to
re-apply later. Adjust the rules in that one function.

## Before launching ads — 4 things to configure

All settings live in `src/funnel/config.ts`.

1. **Stripe $1 Payment Link** (`stripePaymentLink`)
   - Stripe Dashboard → Payment Links → New
   - Product: "Strategy Call Booking Deposit", price **$1.00 USD**, one-time
   - Under *After payment* → redirect to `https://<your-domain>/book?paid=1`
   - Paste the payment link URL into the config.
   - Until this is set, the funnel skips payment and sends qualified
     applicants straight to the calendar (so nothing breaks in testing).

2. **Calendly** (`calendlyUrl`) — currently set to
   `https://calendly.com/p-f-p/dfy-6to7figures`. Name + email are prefilled
   from the application.

3. **Meta Pixel** (`metaPixelId`) — paste your pixel ID. Events fired:
   | Event | Where | Use in Ads Manager |
   |---|---|---|
   | PageView | every page | — |
   | ViewContent | landing | top-of-funnel opt. |
   | Lead | application submitted | mid-funnel opt. |
   | AddPaymentInfo | qualified page shown | qualified-lead opt. |
   | Purchase ($1) | /book?paid=1 | **recommended optimisation event** |
   | Schedule | Calendly booking confirmed | call-booked audiences |

   Optimising campaigns for **Purchase** means Meta optimises for people who
   pass qualification AND pay the $1 — the strongest spam filter signal.

4. **Application webhook** (`applicationWebhookUrl`) — optional. Every
   submission (qualified or not) is POSTed as JSON to this URL. Point it at a
   Zapier/Make/GoHighLevel inbound webhook to capture ALL leads in your CRM —
   including the not-qualified ones for nurture.

## Content to replace before going live

- **Testimonials** in `src/funnel/pages/Landing.tsx` (`Proof` section) are
  structured placeholders — swap in real client names, numbers and photos.
  Remove the section if you can't substantiate the claims (Meta compliance).
- Review the **guarantee wording** in the `Guarantee` section against your
  actual contract terms.

## Hosting note (SPA routing)

The funnel uses real paths (`/apply`, `/book`, …). Configure your host to
rewrite all routes to `index.html`:
- **Netlify**: `/* /index.html 200` in `_redirects`
- **Vercel**: `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`
- **Cloudflare Pages**: works out of the box for SPAs

## Develop / build

```bash
npm install
npm run dev     # local preview
npm run build   # production build → dist/
```

The original performance dashboard still lives at `src/App.tsx` (unused by
this funnel entry point).
