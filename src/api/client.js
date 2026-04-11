/**
 * API client. Default: relative /api (same host + Vite dev proxy to port 8080).
 * Set VITE_API_BASE_URL if the UI is served from a different origin than the API.
 */
const base = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')

const STORAGE_KEY = 'wellness_auth'

export function getStoredAuth() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function saveAuth(payload) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(payload))
}

export function clearAuth() {
  localStorage.removeItem(STORAGE_KEY)
}

function parseErrorBody(text) {
  try {
    const j = JSON.parse(text)
    if (typeof j.message === 'string') return j.message
    if (Array.isArray(j.details) && j.details.length) return j.details.join('; ')
    if (typeof j.error === 'string') return j.error
  } catch {
    /* ignore */
  }
  return text || 'Request failed'
}

export async function api(path, options = {}) {
  const auth = getStoredAuth()
  const headers = { ...(options.headers || {}) }
  if (options.body != null && !headers['Content-Type'] && !headers['content-type']) {
    headers['Content-Type'] = 'application/json'
  }
  if (auth?.token) {
    headers.Authorization = `Bearer ${auth.token}`
  }

  const url = `${base}${path.startsWith('/') ? path : `/${path}`}`
  const res = await fetch(url, { ...options, headers })

  if (res.status === 401) {
    clearAuth()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('wellness-auth-lost'))
    }
    const msg = await res.text()
    throw new Error(parseErrorBody(msg) || 'Unauthorized')
  }

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(parseErrorBody(msg))
  }

  if (res.status === 204 || res.headers.get('content-length') === '0') {
    return null
  }

  const ct = res.headers.get('content-type') || ''
  if (!ct.includes('application/json')) {
    return null
  }

  return res.json()
}

/** POST with JSON body so servers/proxies always send a readable payload (fixes empty-body POST issues). */
export function apiPostJson(path, json = {}) {
  return api(path, {
    method: 'POST',
    body: JSON.stringify(json),
  })
}

export async function loginRequest(email, password) {
  const url = `${base}/api/auth/login`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(parseErrorBody(text))
  }
  return text ? JSON.parse(text) : null
}

export async function signupRequest(payload) {
  const url = `${base}/api/auth/signup`
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const text = await res.text()
  if (!res.ok) {
    throw new Error(parseErrorBody(text))
  }
  return text ? JSON.parse(text) : null
}
