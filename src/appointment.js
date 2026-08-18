// ── Appointment section ──────────────────────────────────────────────────────
// If a Cal.com link is configured, render the REAL Cal.com inline booking embed
// and listen for a successful booking. Otherwise render a self-contained,
// interactive mock stepper. Both paths hand the result to the shared booking
// state, which unlocks the payment demo.

import { CAL_LINK, CAL_NAMESPACE, CAL_BRAND, SERVICE_NAME, EXAMPLE_DEPOSIT } from './config.js'
import { setBooking } from './state.js'

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const SLOTS = ['08:00', '10:00', '12:00', '14:00', '16:00']

export function initAppointment() {
  const el = document.getElementById('cal-inline')
  if (!el) return

  if (CAL_LINK) {
    mountCalEmbed(el)
  } else {
    const note = document.getElementById('book-note')
    if (note) {
      note.innerHTML = '<strong>Interactive mock:</strong> this is a demonstration of the booking experience. No real appointment is created.'
    }
    renderMockStepper(el)
  }
}

// ── Real Cal.com embed ───────────────────────────────────────────────────────
function mountCalEmbed(el) {
  el.innerHTML =
    '<div class="cal-loading" id="cal-loading"><span class="spinner" aria-hidden="true"></span>Loading booking calendar…</div>'

  // Official Cal.com embed bootstrap (queues calls until embed.js loads).
  ;(function (C, A, L) {
    const p = function (a, ar) { a.q.push(ar) }
    const d = C.document
    C.Cal = C.Cal || function () {
      const cal = C.Cal
      const ar = arguments
      if (!cal.loaded) {
        cal.ns = {}
        cal.q = cal.q || []
        d.head.appendChild(d.createElement('script')).src = A
        cal.loaded = true
      }
      if (ar[0] === L) {
        const api = function () { p(api, arguments) }
        const namespace = ar[1]
        api.q = api.q || []
        if (typeof namespace === 'string') {
          cal.ns[namespace] = cal.ns[namespace] || api
          p(cal.ns[namespace], ar)
          p(cal, ['initNamespace', namespace])
        } else { p(cal, ar) }
        return
      }
      p(cal, ar)
    }
  })(window, 'https://app.cal.com/embed/embed.js', 'init')

  const Cal = window.Cal
  Cal('init', CAL_NAMESPACE, { origin: 'https://cal.com' })
  const api = Cal.ns[CAL_NAMESPACE]

  api('inline', {
    elementOrSelector: '#cal-inline',
    config: { layout: 'month_view' },
    calLink: CAL_LINK,
  })

  api('ui', {
    cssVarsPerTheme: { light: { 'cal-brand': CAL_BRAND } },
    hideEventTypeDetails: false,
    layout: 'month_view',
  })

  api('on', {
    action: 'linkReady',
    callback: () => {
      const loading = document.getElementById('cal-loading')
      if (loading) loading.remove()
    },
  })

  api('on', {
    action: 'bookingSuccessful',
    callback: (e) => handleCalBooking(e && e.detail ? e.detail.data : null),
  })

  // Safety net: if the embed cannot load (offline / blocked), swap to the mock.
  window.setTimeout(() => {
    const loading = document.getElementById('cal-loading')
    const hasIframe = !!el.querySelector('iframe')
    if (loading && !hasIframe) {
      const note = document.getElementById('book-note')
      if (note) note.innerHTML = '<strong>Interactive mock:</strong> live calendar unavailable, showing a demonstration of the booking experience.'
      renderMockStepper(el)
    }
  }, 8000)
}

function handleCalBooking(data) {
  let when = null
  let name = null
  let email = null
  try {
    const b = (data && data.booking) || {}
    const start = b.startTime || (data && data.date) || b.start || null
    if (start) when = formatWhen(start)
    const attendees = b.attendees || (data && data.attendees) || []
    if (attendees && attendees[0]) {
      name = attendees[0].name || null
      email = attendees[0].email || null
    }
  } catch (_) { /* fall through to generic labels */ }

  setBooking({
    service: SERVICE_NAME,
    when: when || 'Your selected slot',
    name: name || null,
    email: email || null,
    amount: EXAMPLE_DEPOSIT,
  })
}

function formatWhen(value) {
  const dt = new Date(value)
  if (isNaN(dt.getTime())) return String(value)
  try {
    return new Intl.DateTimeFormat('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    }).format(dt)
  } catch (_) {
    return dt.toString()
  }
}

// ── Mock stepper fallback ────────────────────────────────────────────────────
function renderMockStepper(el) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const state = { view: new Date(today.getFullYear(), today.getMonth(), 1), date: null, time: null }

  el.innerHTML = `
    <div class="stepper">
      <div class="stepper__cols">
        <div class="stepper__cal">
          <div class="cal-head">
            <button type="button" class="cal-nav" data-nav="-1" aria-label="Previous month">‹</button>
            <span class="cal-title" id="cal-title"></span>
            <button type="button" class="cal-nav" data-nav="1" aria-label="Next month">›</button>
          </div>
          <div class="cal-grid cal-grid--dow" id="cal-dow"></div>
          <div class="cal-grid" id="cal-days" role="grid"></div>
        </div>
        <div class="stepper__slots">
          <p class="stepper__label">Available times</p>
          <div class="slots" id="slots"><p class="slots__hint">Select a date to see times.</p></div>
        </div>
      </div>

      <form class="stepper__details" id="mock-form" novalidate>
        <p class="stepper__label">Your details</p>
        <div class="field-row">
          <label class="field"><span class="field__label">Full name</span>
            <input class="field__input" name="name" type="text" autocomplete="name" required /></label>
          <label class="field"><span class="field__label">Phone</span>
            <input class="field__input" name="phone" type="tel" autocomplete="tel" required /></label>
        </div>
        <label class="field"><span class="field__label">Email</span>
          <input class="field__input" name="email" type="email" autocomplete="email" required /></label>
        <p class="form-error" id="mock-error" role="alert" hidden></p>
        <button type="submit" class="btn btn--primary btn--block" id="mock-submit" disabled>
          Continue to payment
        </button>
      </form>
    </div>
  `

  const dow = el.querySelector('#cal-dow')
  dow.innerHTML = WEEKDAYS.map((d) => `<span class="cal-dow">${d}</span>`).join('')

  const title = el.querySelector('#cal-title')
  const daysEl = el.querySelector('#cal-days')
  const slotsEl = el.querySelector('#slots')
  const form = el.querySelector('#mock-form')
  const submit = el.querySelector('#mock-submit')
  const errEl = el.querySelector('#mock-error')

  function renderMonth() {
    const y = state.view.getFullYear()
    const m = state.view.getMonth()
    title.textContent = `${MONTHS[m]} ${y}`

    const first = new Date(y, m, 1)
    const startPad = (first.getDay() + 6) % 7 // Monday-based leading blanks
    const daysInMonth = new Date(y, m + 1, 0).getDate()

    let html = ''
    for (let i = 0; i < startPad; i++) html += '<span class="cal-cell cal-cell--empty"></span>'
    for (let d = 1; d <= daysInMonth; d++) {
      const cellDate = new Date(y, m, d)
      const dow0 = cellDate.getDay()
      const isPast = cellDate < today
      const isWeekend = dow0 === 0 || dow0 === 6
      const disabled = isPast || isWeekend
      const selected = state.date && cellDate.getTime() === state.date.getTime()
      html += `<button type="button" class="cal-cell${selected ? ' is-selected' : ''}" data-day="${d}" ${disabled ? 'disabled aria-disabled="true"' : ''}>${d}</button>`
    }
    daysEl.innerHTML = html
  }

  function renderSlots() {
    if (!state.date) {
      slotsEl.innerHTML = '<p class="slots__hint">Select a date to see times.</p>'
      return
    }
    // Deterministic "availability": mid-day slot shown as taken.
    slotsEl.innerHTML = SLOTS.map((t) => {
      const taken = t === '12:00'
      const selected = state.time === t
      return `<button type="button" class="slot${selected ? ' is-selected' : ''}" data-slot="${t}" ${taken ? 'disabled aria-disabled="true"' : ''}>${t}${taken ? ' <small>booked</small>' : ''}</button>`
    }).join('')
  }

  function updateSubmit() {
    const data = new FormData(form)
    const ok = state.date && state.time &&
      String(data.get('name') || '').trim().length > 1 &&
      /\S+@\S+\.\S+/.test(String(data.get('email') || '')) &&
      String(data.get('phone') || '').replace(/\D/g, '').length >= 7
    submit.disabled = !ok
    return ok
  }

  // Events
  el.querySelectorAll('.cal-nav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const delta = Number(btn.dataset.nav)
      state.view = new Date(state.view.getFullYear(), state.view.getMonth() + delta, 1)
      renderMonth()
    })
  })

  daysEl.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.cal-cell[data-day]')
    if (!btn || btn.disabled) return
    state.date = new Date(state.view.getFullYear(), state.view.getMonth(), Number(btn.dataset.day))
    state.time = null
    renderMonth()
    renderSlots()
    updateSubmit()
  })

  slotsEl.addEventListener('click', (ev) => {
    const btn = ev.target.closest('.slot[data-slot]')
    if (!btn || btn.disabled) return
    state.time = btn.dataset.slot
    renderSlots()
    updateSubmit()
  })

  form.addEventListener('input', updateSubmit)

  form.addEventListener('submit', (ev) => {
    ev.preventDefault()
    if (!updateSubmit()) {
      errEl.hidden = false
      errEl.textContent = 'Please pick a date and time and complete your details.'
      return
    }
    errEl.hidden = true
    const data = new FormData(form)
    const when = new Intl.DateTimeFormat('en-GB', {
      weekday: 'short', day: 'numeric', month: 'short', year: 'numeric',
    }).format(state.date) + `, ${state.time}`

    setBooking({
      service: SERVICE_NAME,
      when,
      name: String(data.get('name')).trim(),
      email: String(data.get('email')).trim(),
      amount: EXAMPLE_DEPOSIT,
    })
  })

  renderMonth()
  renderSlots()
}
