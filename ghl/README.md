# GHL Funnel Pages — P4P DFY Offer

Five self-contained HTML pages matching the live funnel structure:

| File | URL / GHL funnel step | Purpose |
|---|---|---|
| `index.html` | `/` | Cold-traffic landing page for the DFY offer |
| `pre-booking.html` | `/pre-booking` | Application — **embed your GHL survey here** |
| `dfy-application-payment.html` | `/dfy-application-payment` | $1 spam-filter — **embed your GHL order form here** |
| `book-a-call.html` | `/book-a-call` | Booking — **embed your GHL calendar here** |
| `p4p-congrats.html` | `/p4p-congrats` | Post-booking — **embed your pre-call video here** |

Every page is fully self-contained (all CSS inline, no build step, no external
dependencies except Google Fonts). `shared-styles.css` + `templates/` are the
source; the root `.html` files are the finished pages.

## How to use in GHL

**Option A — paste per page (recommended):**
For each funnel step, add a full-width **Custom JS/HTML** element and paste the
page's entire `<body>` content plus the `<style>…</style>` block from `<head>`.

**Option B — host the files** anywhere static and only rebuild the four embed
sections as GHL funnel steps. (Option A keeps everything in GHL, which is what
you want for tracking.)

Each page contains a clearly marked block:

```
<!-- ▼▼▼ GHL SURVEY EMBED ▼▼▼ ... -->
<div class="embed-slot"> ... </div>
<!-- ▲▲▲ ... ▲▲▲ -->
```

Delete the placeholder `.embed-slot` div and put your GHL embed/element in its
place. The comments in each file say exactly where to find the embed code in
GHL and what redirect to configure.

## Funnel wiring checklist (inside GHL)

1. **Survey** (`/pre-booking`): build the application as a GHL Survey with one
   question per slide:
   - Name, email, phone (contact fields)
   - "Which best describes your business?" — Coach / Consultant / Agency owner / Something else
   - "Current monthly revenue?" — <$2k / $2–5k / $5–10k / $10–20k / $20k+
   - "What's the #1 thing holding your growth back?"
   - "Where do you want revenue to be in 6 months?"
   - "If accepted, are you in a position to invest in your growth?" — Yes now / Yes with the right plan / No
   - "How soon do you want to start?"

   **Disqualification logic** (survey conditional logic / jump rules):
   - role = "Something else" → disqualify
   - revenue = "<$2k" → disqualify
   - revenue = "$2–5k" AND invest ≠ "Yes now" → disqualify
   - invest = "No" → disqualify
   - Qualified → redirect to `/dfy-application-payment`
   - Disqualified → polite end-message (honest "not yet — re-apply at $5k+/mo")
   - Tag contacts `dfy-qualified` / `dfy-not-qualified` for follow-up automations.

2. **Order form** (`/dfy-application-payment`): create product
   **"Strategy Call Deposit" — $1.00 one-time**, attach it to a 1-step order
   form on this step. On success → next step `/book-a-call`.

3. **Calendar** (`/book-a-call`): place your strategy-call calendar widget.
   Calendar settings → Confirmation → **redirect to `/p4p-congrats`**.

4. **Video** (`/p4p-congrats`): paste your pre-call video embed (YouTube
   unlisted / Vimeo / GHL video).

5. **Tracking**: install the Meta Pixel site-wide (GHL Settings → Tracking
   Code), then add pixel events per step — suggested mapping:
   - `/pre-booking` view → ViewContent
   - survey submitted → Lead
   - `/dfy-application-payment` view → AddPaymentInfo
   - $1 purchase → Purchase (value 1 USD) ← **optimise your ad campaigns on this**
   - booking confirmed → Schedule

## Before going live

- Replace the three **testimonial placeholders** on `index.html` with real
  client names/results (Meta rejects unsubstantiated claims).
- Check the **guarantee wording** against your actual contract terms.
- The pre-call video on `/p4p-congrats` should cover: how the call runs, what
  to prepare, one client story.

## Editing

Edit `templates/*.html` (copy) or `shared-styles.css` (design), then rebuild:

```bash
cd ghl && node -e "const fs=require('fs');const css=fs.readFileSync('shared-styles.css','utf8');for(const f of fs.readdirSync('templates')){fs.writeFileSync(f,fs.readFileSync('templates/'+f,'utf8').replace('/*__SHARED_CSS__*/',css.trim()))}"
```
