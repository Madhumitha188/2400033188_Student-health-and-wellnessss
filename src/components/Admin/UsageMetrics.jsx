import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../api/client'

const UsageMetrics = () => {
  const [summary, setSummary] = useState(null)
  const [recent, setRecent] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setErr('')
    try {
      const [s, r] = await Promise.all([
        api('/api/admin/analytics/summary'),
        api('/api/admin/analytics/recent?limit=30'),
      ])
      setSummary(s)
      setRecent(Array.isArray(r) ? r : [])
    } catch (e) {
      setErr(e.message || 'Failed to load metrics')
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
        <p style={{ color: 'var(--text-muted)' }}>Loading metrics…</p>
      </motion.div>
    )
  }

  if (err) {
    return (
      <motion.div className="card login-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {err}
      </motion.div>
    )
  }

  const m = summary || {}

  return (
    <div>
      <div className="grid" style={{ marginBottom: '30px' }}>
        {[
          { k: 'totalUsers', label: 'Total users' },
          { k: 'activeResources', label: 'Active resources' },
          { k: 'activePrograms', label: 'Active programs' },
          { k: 'totalSessions', label: 'Activity events' },
        ].map((item, i) => (
          <motion.div
            key={item.k}
            className="stat-card"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02 }}
          >
            <h3>{m[item.k] ?? 0}</h3>
            <p>{item.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <h2>Resource usage by category</h2>
        <div className="grid" style={{ marginTop: '20px' }}>
          {['Mental Health', 'Fitness', 'Nutrition'].map((label, i) => {
            const key =
              label === 'Mental Health'
                ? 'mentalHealthAccess'
                : label === 'Fitness'
                  ? 'fitnessAccess'
                  : 'nutritionAccess'
            return (
              <motion.div
                key={label}
                className="resource-card"
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 + i * 0.05 }}
                whileHover={{ y: -4 }}
              >
                <h3>{label}</h3>
                <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#2dd4bf', marginTop: '12px' }}>
                  {m[key] ?? 0} accesses
                </p>
              </motion.div>
            )
          })}
        </div>
      </motion.div>

      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
        <h2>Recent activity</h2>
        <table className="table">
          <thead>
            <tr>
              <th>When</th>
              <th>User</th>
              <th>Action</th>
              <th>Detail</th>
            </tr>
          </thead>
          <tbody>
            {recent.length === 0 ? (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                  No activity yet. Students trigger events when they open resources or enroll.
                </td>
              </tr>
            ) : (
              recent.map((row, i) => (
                <tr key={`${row.at}-${i}`}>
                  <td>{row.at ? new Date(row.at).toLocaleString() : '—'}</td>
                  <td>{row.userEmail}</td>
                  <td>{row.actionLabel}</td>
                  <td>{row.detail}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </motion.div>
    </div>
  )
}

export default UsageMetrics
