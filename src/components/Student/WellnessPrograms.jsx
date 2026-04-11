import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api, apiPostJson } from '../../api/client'

const fmtDate = (v) => {
  if (!v) return '—'
  if (typeof v === 'string') return v
  if (Array.isArray(v) && v.length >= 3) {
    const [y, m, d] = v
    return `${String(y)}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
  }
  return String(v)
}

const WellnessPrograms = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [popup, setPopup] = useState('')

  const load = useCallback(async () => {
    setErr('')
    try {
      const data = await api('/api/programs')
      setPrograms(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Could not load programs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleEnroll = async (programId) => {
    setBusyId(programId)
    setErr('')
    try {
      await apiPostJson(`/api/programs/${programId}/enroll`, {})
      setPopup('You are enrolled successfully!')
      window.setTimeout(() => setPopup(''), 2400)
      await load()
    } catch (e) {
      setErr(e.message || 'Enrollment failed')
    } finally {
      setBusyId(null)
    }
  }

  if (loading) {
    return (
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading programs…</p>
      </motion.div>
    )
  }

  return (
    <div>
      {popup && <div className="toast-success">{popup}</div>}
      {err && (
        <motion.div className="login-error" style={{ marginBottom: 16 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {err}
        </motion.div>
      )}
      <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2>Wellness Programs</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>
          Join cohorts that fit your goals — enrollment syncs instantly with the admin dashboard.
        </p>
      </motion.div>

      <div className="grid">
        {programs.map((program, index) => {
          const isEnrolled = program.enrolled === true
          return (
            <motion.article
              key={program.id}
              className="resource-card"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.06 }}
              whileHover={{ y: -6 }}
            >
              <span className="pill">{program.type}</span>
              <h3>{program.name}</h3>
              <p>{program.description}</p>
              <div
                style={{
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--border)',
                }}
              >
                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Duration</strong> {program.duration || '—'}
                </p>
                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Start</strong> {fmtDate(program.startDate)}
                </p>
                <p style={{ fontSize: '14px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Participants</strong> {program.participants ?? 0}
                </p>
              </div>
              <motion.button
                type="button"
                className={`btn ${isEnrolled ? 'btn-secondary' : 'btn-primary'}`}
                style={{ width: '100%', marginTop: '16px' }}
                disabled={isEnrolled || program.status !== 'ACTIVE' || busyId === program.id}
                onClick={() => handleEnroll(program.id)}
                whileTap={{ scale: 0.98 }}
              >
                {busyId === program.id
                  ? 'Enrolling…'
                  : isEnrolled
                    ? 'Enrolled ✓'
                    : program.status !== 'ACTIVE'
                      ? 'Not available'
                      : 'Enroll now'}
              </motion.button>
            </motion.article>
          )
        })}
      </div>
    </div>
  )
}

export default WellnessPrograms
