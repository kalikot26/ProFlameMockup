// ── Shared booking state ─────────────────────────────────────────────────────
// A tiny pub/sub store so the appointment step (Cal.com embed OR mock stepper)
// can hand the confirmed booking to the payment step.

export const booking = {
  service: null, // e.g. "Oil Boiler Service"
  when: null,    // human-readable date/time string
  name: null,
  email: null,
  amount: null,  // number (GBP), example only
}

const listeners = new Set()

export function setBooking(patch) {
  Object.assign(booking, patch)
  for (const fn of listeners) fn(booking)
}

export function onBooking(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}
