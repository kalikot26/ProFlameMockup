# Pro Flame — Oil Boiler Services (Concept Preview)

A single-page **concept mockup** for an "Oil Boiler Services" page, built as a client-ready
preview. It demonstrates two things a future site could offer:

1. **Book an appointment** — a real [Cal.com](https://cal.com) inline booking widget.
2. **Pay a deposit** — a Square-style card payment **demonstration** (nothing is ever charged).

> **This is a concept/demo.** Branding and copy are neutral placeholders, the payment step is a
> visual demo only, and the booking widget points at a **demo calendar** — not a real customer
> calendar. Nothing here implies a finished Cal.com/Square production integration.

---

## Quick start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (default <http://localhost:5173>).

## Production build

```bash
npm run build     # outputs static files to ./dist
npm run preview   # serve the built ./dist locally to check it
```

- **Static output directory:** `dist/`
- Asset paths are **relative** (`base: './'` in `vite.config.js`), so `dist/` can be served from a
  domain root **or** a sub-path / sub-domain without changes.

---

## What's real vs mocked

| Area | Status in this preview |
|------|------------------------|
| **Appointment booking** | **Real Cal.com embed.** Loads the official widget and books into a **demo calendar**. On a successful booking it reveals the payment step. |
| **Payment** | **Mocked.** Card fields are disabled, no card data is captured, no Square SDK is loaded, and no network/charge happens. "Pay" simulates a confirmation. |
| **Branding / copy / contact** | **Placeholder.** Neutral brand ("OilCare Heating"), generic reassurance copy, placeholder phone/email. No specific accreditations, review counts, or real contact details are asserted. |
| **Pricing** | Example figure, clearly labelled "for demonstration only." |

### Cal.com configuration

The booking link is a **public** Cal.com link (`username/event-slug`) — **not** an API key or secret.

- A default is baked into [`src/config.js`](src/config.js), so the app works out of the box.
- To override it (e.g. to point at a dedicated **"Oil Boiler Service"** event type once created),
  copy `.env.example` to `.env` and set `VITE_CAL_LINK`.
- Set `VITE_CAL_LINK` **blank** to replace the live widget with the built-in interactive mock
  stepper (calendar → time slots → contact details), which populates the same payment demo.

---

## What real integration would replace later

- **Cal.com:** swap the demo calendar for the client's own Cal.com account / a dedicated
  "Oil Boiler Service" event type. (Optionally drive bookings via the Cal.com API v2 + webhooks if
  durable booking state is needed.)
- **Square:** replace the mocked payment card with a real **Square Web Payments SDK** card form
  (tokenise in-browser) + a small server endpoint calling the **Square Payments API**, or a
  **Square-hosted Checkout / Payment Link**. Requires HTTPS and an appropriate CSP.

Neither of those is wired here, by design.

---

## Deploying the preview (static hosting)

The build is plain static files — serve `dist/` behind nginx (or any static host):

1. `npm run build`
2. Copy `dist/` to the demo server and point an nginx `location` / server block at it.
3. **CSP note:** the Cal.com embed loads `https://app.cal.com` and frames `https://cal.com`.
   If a Content-Security-Policy is applied, allow those in `script-src` / `frame-src`
   (and `connect-src`), or the booking widget won't load.
4. **Rollback** is a directory/symlink swap — keep the previous `dist/` and switch back if needed.

No secrets, `.env` files, or credentials are needed to build or serve this preview.

---

## Project structure

```
index.html            Single page, all sections
src/
  main.js             Entry: fonts, content data, nav, boots the demos
  styles.css          Design tokens + all styles (responsive)
  config.js           Cal.com link + demo constants
  state.js            Tiny shared booking store (appointment → payment)
  appointment.js      Cal.com embed + mock-stepper fallback
  payment.js          Square-style payment demo (inert)
public/               favicon, robots.txt
vite.config.js        base:'./', dist/ output
```

## Tech

Plain HTML/CSS/vanilla JS bundled with **Vite**. Fonts (Sora, Inter) are bundled locally via
`@fontsource` — no external font CDN. No framework, no backend, no database.
