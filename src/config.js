// ── Demo configuration ───────────────────────────────────────────────────────
// The Cal.com booking link is a PUBLIC link (username/event-slug), not a secret.
// A default is baked in here so the app works out of the box; override it with
// VITE_CAL_LINK in a .env file (see .env.example). Set it blank to force the
// built-in mock stepper instead of the live embed.

const DEFAULT_CAL_LINK = 'johnvenice-almazan-qruh8a/30min'

const envLink = import.meta.env.VITE_CAL_LINK
export const CAL_LINK = (envLink === undefined ? DEFAULT_CAL_LINK : envLink).trim()

// Cal.com embed namespace + theming.
export const CAL_NAMESPACE = 'oil-boiler'
export const CAL_BRAND = '#E11B22'

// Service presented in the mockup.
export const SERVICE_NAME = 'Oil Boiler Service'
export const SERVICE_DURATION = '30 min'

// Clearly-labelled EXAMPLE amount (GBP) — for demonstration only, never charged.
export const EXAMPLE_DEPOSIT = 79
