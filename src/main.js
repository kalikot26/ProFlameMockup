// ── App entry ────────────────────────────────────────────────────────────────
import '@fontsource/inter/latin-400.css'
import '@fontsource/inter/latin-500.css'
import '@fontsource/inter/latin-600.css'
import '@fontsource/inter/latin-700.css'
import '@fontsource/sora/latin-700.css'
import '@fontsource/sora/latin-800.css'
import './styles.css'

import { initAppointment } from './appointment.js'
import { initPayment } from './payment.js'

// ── Content (generic, no specific/verifiable claims) ─────────────────────────
const SERVICES = [
  { icon: 'boiler', title: 'Installation & upgrades', body: 'New oil-fired boiler supply and installation, plus efficiency upgrades — installed to regulation.' },
  { icon: 'shield', title: 'Servicing & safety checks', body: 'Routine servicing and safety checks to keep your heating running safely and efficiently.' },
  { icon: 'wrench', title: 'Repairs & fault-finding', body: 'Expert diagnosis and repair when something isn’t working — most faults sorted on the first visit.' },
  { icon: 'tank', title: 'Oil tank & supply', body: 'Tank checks, supply issues and pipework — keeping your fuel supply safe and reliable.' },
  { icon: 'clock', title: 'Emergency callout', body: 'No heating or hot water? Fast local response when you need an engineer at short notice.' },
  { icon: 'leaf', title: 'Efficiency advice', body: 'Clear, honest advice on getting the most from your system and lowering running costs.' },
]

const REASSURANCE = [
  { title: 'Registered & qualified', body: 'Work carried out by registered, qualified heating engineers.' },
  { title: 'Fixed-price quotes', body: 'A clear price agreed up front after we understand the job — no surprises.' },
  { title: 'Guaranteed workmanship', body: 'Every job is backed by a workmanship guarantee.' },
  { title: 'Respectful in your home', body: 'Tidy, considerate engineers who treat your home with care.' },
  { title: 'Fast local response', body: 'Locally based, so we can get to you quickly when it matters.' },
  { title: 'Honest advice', body: 'Straight answers and sensible recommendations, every time.' },
]

const FAQ = [
  { q: 'How do I book an appointment?', a: 'Pick a date and time in the booking calendar and add your details — you’ll get a confirmation straight away.' },
  { q: 'Do I have to pay when I book?', a: 'A small deposit secures your appointment. The balance is settled once the work is complete.' },
  { q: 'Is my payment secure?', a: 'Payments are taken through a secure card checkout. (This preview shows a demonstration of that step — nothing is charged.)' },
  { q: 'What if I need to change my appointment?', a: 'No problem — you can reschedule from your confirmation, or get in touch and we’ll sort it out.' },
  { q: 'Do you guarantee your work?', a: 'Yes. All work is backed by a workmanship guarantee for your peace of mind.' },
]

const ICONS = {
  boiler: '<rect x="5" y="3" width="14" height="18" rx="3"/><rect x="8" y="6" width="8" height="5" rx="1.5"/><path d="M12 13c1.5 1.2 1.5 3.4 0 4.6"/>',
  shield: '<path d="M12 3l7 3v5c0 4.4-3 7.6-7 9-4-1.4-7-4.6-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  wrench: '<path d="M15 4a5 5 0 0 0-6.5 6.5L4 15l3 3 4.5-4.5A5 5 0 0 0 20 9l-3 3-2-2 3-3a5 5 0 0 0-3-3z"/>',
  tank: '<rect x="4" y="6" width="16" height="12" rx="3"/><path d="M8 6V4h5v2"/><path d="M7 11h7"/>',
  clock: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  leaf: '<path d="M5 19c0-7 5-12 14-13 0 9-5 14-13 13z"/><path d="M9 15c2-2.5 4.5-4.5 8-6"/>',
}

function iconSvg(name) {
  return `<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ''}</svg>`
}

function renderServices() {
  const grid = document.getElementById('services-grid')
  if (!grid) return
  grid.innerHTML = SERVICES.map((s) => `
    <article class="card">
      <span class="card__icon">${iconSvg(s.icon)}</span>
      <h3>${s.title}</h3>
      <p>${s.body}</p>
    </article>`).join('')
}

function renderReassurance() {
  const grid = document.getElementById('reassurance-grid')
  if (!grid) return
  grid.innerHTML = REASSURANCE.map((r) => `
    <div class="reassure">
      <span class="reassure__tick" aria-hidden="true">✓</span>
      <div><h3>${r.title}</h3><p>${r.body}</p></div>
    </div>`).join('')
}

function renderFaq() {
  const list = document.getElementById('faq-list')
  if (!list) return
  list.innerHTML = FAQ.map((f) => `
    <details class="faq-item">
      <summary>${f.q}<span class="faq-item__chev" aria-hidden="true">⌄</span></summary>
      <div class="faq-item__body"><p>${f.a}</p></div>
    </details>`).join('')
}

function initNav() {
  const toggle = document.getElementById('nav-toggle')
  const header = document.querySelector('.site-header')
  if (!toggle || !header) return

  toggle.addEventListener('click', () => {
    const open = header.classList.toggle('is-open')
    toggle.setAttribute('aria-expanded', String(open))
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu')
  })

  header.querySelectorAll('.nav a').forEach((a) => {
    a.addEventListener('click', () => {
      header.classList.remove('is-open')
      toggle.setAttribute('aria-expanded', 'false')
      toggle.setAttribute('aria-label', 'Open menu')
    })
  })
}

function initYear() {
  const y = document.getElementById('year')
  if (y) y.textContent = String(new Date().getFullYear())
}

// ── Boot ─────────────────────────────────────────────────────────────────────
renderServices()
renderReassurance()
renderFaq()
initNav()
initYear()
initAppointment()
initPayment()
