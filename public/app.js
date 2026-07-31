const TONES = [
  { label: 'Formal', tint: 'blue' },
  { label: 'Casual', tint: 'green' },
  { label: 'Informal', tint: 'yellow' },
  { label: 'Funny', tint: 'red' },
  { label: 'Concise', tint: 'neutral' },
]

const input = document.getElementById('input')
const custom = document.getElementById('custom')
const run = document.getElementById('run')
const status = document.getElementById('status')
const statusWrap = document.getElementById('statusWrap')
const resultWrap = document.getElementById('resultWrap')
const resultTone = document.getElementById('resultTone')
const output = document.getElementById('output')
const copy = document.getElementById('copy')
const copyLabel = document.getElementById('copyLabel')

let selected = TONES[0].label

const buttons = TONES.map(({ label, tint }) => {
  const b = document.createElement('button')
  b.type = 'button'
  b.textContent = label
  b.dataset.tint = tint
  b.addEventListener('click', () => {
    selected = label
    custom.value = ''
    paint()
  })
  document.getElementById('tones').append(b)
  return b
})

function paint() {
  buttons.forEach((b) => {
    const isSelected = b.textContent === selected
    b.className = `tag tag--${b.dataset.tint}${isSelected ? ' is-selected' : ''}`
    b.setAttribute('aria-pressed', String(isSelected))
  })
}

function setStatus(message, isError = false) {
  status.textContent = message
  status.classList.toggle('is-error', isError)
  statusWrap.classList.toggle('is-hidden', !message)
}

custom.addEventListener('input', () => {
  selected = custom.value.trim() ? null : TONES[0].label
  paint()
})

async function rewrite() {
  const text = input.value.trim()
  const tone = custom.value.trim() || selected

  if (!text) return setStatus('Add some text first.', true)
  if (!tone) return setStatus('Pick or describe a tone.', true)

  run.disabled = true
  setStatus('Rewriting…')

  try {
    const res = await fetch('/api/rewrite', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, tone }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `Request failed (${res.status})`)

    output.textContent = data.result
    resultTone.textContent = `\u2014 ${tone}`
    resultWrap.classList.remove('is-hidden')
    requestAnimationFrame(() => resultWrap.classList.add('is-visible'))
    setStatus('')
  } catch (err) {
    setStatus(err.message, true)
  } finally {
    run.disabled = false
  }
}

run.addEventListener('click', rewrite)

document.addEventListener('keydown', (e) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') rewrite()
})

copy.addEventListener('click', async () => {
  await navigator.clipboard.writeText(output.textContent)
  copyLabel.textContent = 'Copied'
  setTimeout(() => (copyLabel.textContent = 'Copy'), 1200)
})

/* Theme ------------------------------------------------------------------ */

const root = document.documentElement
const themeToggle = document.querySelector('.theme-toggle')
const systemDark = window.matchMedia('(prefers-color-scheme: dark)')
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')

function storedTheme() {
  try { return localStorage.getItem('theme') } catch { return null }
}

function setTheme(theme, persist = false) {
  const apply = () => (root.dataset.theme = theme)
  if (document.startViewTransition && !reducedMotion.matches) {
    document.startViewTransition(apply)
  } else {
    apply()
  }
  if (persist) {
    try { localStorage.setItem('theme', theme) } catch {}
  }
}

themeToggle.addEventListener('click', () => {
  setTheme(root.dataset.theme === 'dark' ? 'light' : 'dark', true)
})

systemDark.addEventListener('change', (e) => {
  if (storedTheme()) return // an explicit choice wins over system changes
  setTheme(e.matches ? 'dark' : 'light')
})

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return
      entry.target.classList.add('is-visible')
      observer.unobserve(entry.target)
    })
  },
  { threshold: 0.15 },
)

document.querySelectorAll('.reveal:not(.is-hidden)').forEach((el) => observer.observe(el))

paint()
