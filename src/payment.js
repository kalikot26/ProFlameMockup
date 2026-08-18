// ── Payment demo ─────────────────────────────────────────────────────────────
// Revealed once an appointment exists. Everything here is inert: card fields are
// disabled, nothing is submitted anywhere, no Square SDK is loaded. The "Pay"
// button simulates processing and shows a demo confirmation.

import { onBooking } from './state.js'

function gbp(n) {
  return new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'GBP' }).format(Number(n) || 0)
}

function demoRef() {
  // Visibly fake reference, no randomness relied upon for anything real.
  const t = Date.now().toString(36).toUpperCase().slice(-6)
  return `DEMO-${t}`
}

export function initPayment() {
  const section = document.getElementById('pay')
  const form = document.getElementById('pay-form')
  const success = document.getElementById('pay-success')
  const payBtn = document.getElementById('pay-btn')
  const resetBtn = document.getElementById('pay-reset')
  if (!section || !form || !success || !payBtn) return

  const sumService = document.getElementById('sum-service')
  const sumWhen = document.getElementById('sum-when')
  const sumName = document.getElementById('sum-name')
  const sumAmount = document.getElementById('sum-amount')
  const payAmount = document.getElementById('pay-btn-amount')
  const refEl = document.getElementById('pay-ref')

  let revealed = false

  onBooking((b) => {
    if (b.service) sumService.textContent = b.service
    sumWhen.textContent = b.when || '—'
    sumName.textContent = b.name || '—'
    if (b.amount != null) {
      sumAmount.textContent = gbp(b.amount)
      payAmount.textContent = gbp(b.amount)
    }

    // Reset to the form state for a fresh booking, then reveal + scroll once.
    form.hidden = false
    success.hidden = true
    section.hidden = false

    if (!revealed) {
      revealed = true
      section.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  })

  form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    if (payBtn.classList.contains('is-loading')) return
    payBtn.classList.add('is-loading')
    payBtn.disabled = true
    const original = payBtn.innerHTML
    payBtn.innerHTML = '<span class="spinner spinner--onDark" aria-hidden="true"></span> Processing…'

    window.setTimeout(() => {
      refEl.textContent = demoRef()
      form.hidden = true
      success.hidden = false
      // restore button for a possible re-run
      payBtn.classList.remove('is-loading')
      payBtn.disabled = false
      payBtn.innerHTML = original
      success.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }, 1400)
  })

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      success.hidden = true
      form.hidden = false
      form.scrollIntoView({ behavior: 'smooth', block: 'center' })
    })
  }
}
