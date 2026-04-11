import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../api/client'

const SupportInbox = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setErr('')
    try {
      const data = await api('/api/admin/support/requests')
      setItems(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Failed to load support requests')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  if (loading) {
    return (
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading support requests…</p>
      </motion.div>
    )
  }

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {err && <div className="login-error">{err}</div>}
      <h2>Support requests</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
        Form submissions from the portal. Click an email to open your mail app.
      </p>
      <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>When</th>
            <th>Name</th>
            <th>Email</th>
            <th>Type</th>
            <th>Message</th>
            <th>Account</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                No requests yet.
              </td>
            </tr>
          ) : (
            items.map((r) => (
              <tr key={r.id}>
                <td>{r.createdAt ? new Date(r.createdAt).toLocaleString() : '—'}</td>
                <td>{r.requesterName}</td>
                <td>
                  {r.requesterEmail ? (
                    <a className="link-inline" href={`mailto:${r.requesterEmail}`}>
                      {r.requesterEmail}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>{r.serviceType}</td>
                <td style={{ maxWidth: 280, whiteSpace: 'pre-wrap' }}>{r.message}</td>
                <td>
                  {r.submittedByEmail ? (
                    <a className="link-inline" href={`mailto:${r.submittedByEmail}`}>
                      {r.submittedByEmail}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  )
}

export default SupportInbox
