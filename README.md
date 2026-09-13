# CA CARS 3-Day Cancel Clock

**Paste (1) California dealer used-vehicle purchase/lease? yes/no, (2) contract price ≤ $50,000? yes/no, (3) contract execution date OR “not yet purchased / pre–Oct 1”, (4) view date (+ optional miles &gt;400) → one shareable card:**  
giant **not yet in force / days until Oct 1 / inside 3-day cancel window / past window / not eligible (new / &gt;$50k / private party / &gt;400 miles)** · **3 calendar days starting the day after contract** chip (closed-day roll literacy) · **≤400 miles / restocking fee literacy** strip · Civ. Code **§1784.43** + dealer 3-Day Right to Cancel disclosure pointer.

Brand on the surface: **CA CARS 3-Day Cancel Clock** only.

**Not legal advice. Not lemon-law.** Return during business hours. CA used ≤$50k only. New vehicles have no cooling-off per statute notice. We never invent THIS buyer’s restocking $. User-pasted flags only — zero VIN / DMS scrape.

## Hypothesis

CA shoppers still believe “all car sales are final” or confuse the old paid 2-day cancel option with the new **automatic** 3-day right. Flip “can I still return this used car?” fog into a **contract-date-honest share clock** — without scraping dealers or funneling lemon-law leads. Success = “paste your contract date — how many days left?” shares before Oct 1 and in the 72 hours after used closings.

## How to test (local)

```bash
cd kb/mde/ca-cars-3day-cancel
npm run build          # copies assets → dist/
npm run verify         # Oct 1 gate + 3-day math + eligibility outs + brand-clean
# either open the file:
open index.html        # or dist/index.html
# or serve:
npm start              # http://localhost:4247
```

Manual checklist:

1. Open the page → click **Used $28k · Sep 28 pre–Oct 1** → giant **Not yet in force** + days until Oct 1 (18 from Sep 13 view).
2. Click **Oct 2 contract · view Oct 3 inside** → **Inside 3-day cancel window** (Oct 3→Oct 5).
3. Click **Past window** → Past window badge.
4. Click **New vehicle · out** → Not eligible.
5. Click **&gt;$50k · out** → Not eligible (&gt;$50k).
6. Click **Empty / missing dates** → honest miss (date mode without contract date).
7. Toggle miles &gt;400 on an otherwise-eligible deal → Not eligible (&gt;400 miles).
8. Paste your own flags → **Show cancel clock**.
9. **Copy summary** → clipboard has status + window chip + §1784.43 cite + disclaimer.
10. **Share link** → `#p=` restores the card.
11. **Export PNG** → dark clock card with giant status + disclaimer on the face (not color-only).
12. Surface brand is **CA CARS 3-Day Cancel Clock** only (no Conglomerate / personal names).

### GitHub Pages

This folder is static-ready. Point Pages at `/` of a dedicated repo (or `/docs` after copying `dist/`), with `index.html` at the site root. Relative paths (`styles.css`, `app.js`) work on project pages.

```bash
npm run build   # optional artifact in dist/
```

Do **not** create the public repo or post from this build step — Steward handles Pages + distro. Distro stays product-linked only (e.g. r/whatcarshouldIbuy, r/California in the Sep 20–Oct 15 window, then post-close refreshes). **No sock accounts.** No “dealers are thieves” farms.

## Seed cohort (MVP)

Labeled teaching dates — not live dealer scrapes. Never invent a buyer’s restocking $.

| Chip | Inputs | Teaching point |
|------|--------|----------------|
| Used $28k · Sep 28 pre–Oct 1 | CA used · ≤$50k · pre mode · view 2026-09-13 | Not yet in force · ~18 days to Oct 1 |
| Oct 2 contract · view Oct 3 inside | CA used · ≤$50k · contract 2026-10-02 · view 2026-10-03 | Inside window Oct 3→Oct 5 |
| Past window | Same contract · view 2026-10-10 | Past window |
| New vehicle · out | CA dealer used = no | Not eligible (new / private party) |
| &gt;$50k · out | price chip no | Not eligible (&gt;$50k) |
| Empty / missing dates | date mode · blank contract | Honest miss |

## Calendar logic (public statute framing)

| Rule | Framing |
|------|---------|
| Operative | **Oct 1 2026** (Civ. Code §1784.43 / SB 766) |
| Pre-force | Not yet purchased / pre–Oct 1 → **not yet in force** + days until Oct 1 |
| Window | Day **after** contract through **contract + 3** calendar days |
| Closed-day roll | If day 3 is a closed dealership day → next open day (**confirm hours** — we do not invent them) |
| ≤$50k | Price chip no → **not eligible** |
| Not CA dealer used | → **not eligible** (new / private party / out of scope) |
| &gt;400 miles | → **not eligible** (mileage cap) |
| Restocking | Literacy only: **1.5%** ($200 min / $600 max) + up to **$150** mileage over 250 (CarPro) — **never invent THIS buyer’s $** |
| Pointers | leginfo §1784.43 · dealer 3-Day Right to Cancel disclosure |
| New vehicles | **No** cooling-off per statute notice |

## Ads pathway (ad-only free utility — do not spend yet)

| Path | Notes |
|------|--------|
| **Revenue (primary)** | **AdSense / display under the card + “what is California’s 3-day used-car cancel right?” explainer** (not inside the PNG). Inventory spikes Sep 20–Oct 15 and on each post-Oct used-car-return headline. Justified when sessions cover hosting. Free card forever — **no paywall**, no Gumroad. |
| **Brand-safe** | Informational clock + public Civil Code / CarPro / NCLC cites. **Not legal advice. Not lemon-law.** Ads **not** inside PNG. **Hard-avoid** lemon-law / we-buy-cars / refinance lead-gen affiliates. Statute + official disclosure literacy only. |
| **Acquisition (gated)** | Google “California used car 3 day return October 2026” / “SB 766 CARS Act cancel” + Reddit CA promo. Creative = “Paste your contract date — still inside the 3-day window?”. Max CPA abort ~$0.30–0.50 without a completed share. Debit/cash only. **Spend only after one organic CA-thread test.** |
| **UTM** | Example: `?utm_source=reddit&utm_medium=organic&utm_campaign=ca_cars_3day_cancel_mvp` |
| **Tracking** | Card gens + share clicks (GoatCounter path when Pages is live). |
| **Abort sketch** | Pause paid if CPA exceeds band without share / “how many days left?” replies. |

**No spend from this ready_for_pages step.** Ads are the monetization path (**ad-only OK**).

## Product constraints

- Single static site (no backend).
- **Flags only from user paste** (or labeled seeds). Never invent restocking $, eligibility beyond paste, or dealer hours.
- Brand: **CA CARS 3-Day Cancel Clock** only on surface.
- Status text-labeled (not color-only). Disclaimer always visible on page + share PNG.
- Share = URL hash + PNG + copy summary.
- No VIN scrape. No DMS login. No lemon-law funnel. No we-buy-cars / refinance affiliates. No sock farms.

## Files

| Path | Role |
|------|------|
| `index.html` | App shell (GitHub Pages entry) |
| `app.js` | Oct 1 gate, 3-day window math, eligibility outs, seeds, card, share hash, PNG |
| `styles.css` | CA CARS 3-Day Cancel Clock UI |
| `scripts/build.js` | `npm run build` → `dist/` |
| `scripts/verify.js` | `npm run verify` — Oct 1 + 3-day + outs |
| `package.json` | build / start / preview / verify scripts |

## Opportunity

Internal card: `opp_auto_ca_cars_3day_cancel` (auto retail / California).  
Experiment stub: `institutions/mde/experiments/exp_ca_cars_3day_cancel.md`.
