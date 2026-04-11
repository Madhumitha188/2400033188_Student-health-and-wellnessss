import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../api/client'

const displayStatus = (s) => (s === 'ACTIVE' ? 'Active' : 'Inactive')

const WellnessPrograms = () => {
  const [programs, setPrograms] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    type: 'Fitness',
    description: '',
    duration: '',
    startDate: '',
  })

  const load = useCallback(async () => {
    setErr('')
    try {
      const data = await api('/api/admin/programs')
      setPrograms(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Failed to load programs')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async () => {
    if (!formData.name?.trim() || !formData.description?.trim()) return
    setErr('')
    try {
      await api('/api/admin/programs', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          type: formData.type,
          description: formData.description.trim(),
          duration: formData.duration?.trim() || null,
          startDate: formData.startDate || null,
        }),
      })
      setFormData({
        name: '',
        type: 'Fitness',
        description: '',
        duration: '',
        startDate: '',
      })
      setShowModal(false)
      await load()
    } catch (e) {
      setErr(e.message || 'Could not create program')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this program and its enrollments?')) return
    setErr('')
    try {
      await api(`/api/admin/programs/${id}`, { method: 'DELETE' })
      await load()
    } catch (e) {
      setErr(e.message || 'Delete failed')
    }
  }

  const toggleStatus = async (id) => {
    setErr('')
    try {
      await api(`/api/admin/programs/${id}/status`, { method: 'PATCH' })
      await load()
    } catch (e) {
      setErr(e.message || 'Update failed')
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
    <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      {err && (
        <div className="login-error" style={{ marginBottom: 16 }}>
          {err}
        </div>
      )}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <h2>Wellness programs</h2>
        <motion.button
          type="button"
          className="btn btn-primary"
          onClick={() => setShowModal(true)}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          + Add program
        </motion.button>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 18, lineHeight: 1.5 }}>
        Toggle visibility for students or remove outdated offerings. Enrollments are cleared when a program is deleted.
      </p>

      <div className="grid">
        {programs.map((program, index) => (
          <motion.div
            key={program.id}
            className="resource-card"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, type: 'spring', stiffness: 260, damping: 26 }}
            whileHover={{ y: -4 }}
          >
            <span className="pill">{program.type}</span>
            <h3>{program.name}</h3>
            <p>
              <strong style={{ color: 'var(--text-muted)' }}>Participants</strong> {program.participants}
            </p>
            <p>
              <strong style={{ color: 'var(--text-muted)' }}>Status</strong>{' '}
              <span
                style={{
                  color: program.status === 'ACTIVE' ? '#5eead4' : '#fb7185',
                  fontWeight: '600',
                  marginLeft: '4px',
                }}
              >
                {displayStatus(program.status)}
              </span>
            </p>
            <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
              <motion.button
                type="button"
                className="btn btn-secondary"
                style={{ flex: 1, padding: '8px', fontSize: '14px' }}
                onClick={() => toggleStatus(program.id)}
                whileTap={{ scale: 0.98 }}
              >
                {program.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
              </motion.button>
              <motion.button
                type="button"
                className="btn btn-danger"
                style={{ flex: 1, padding: '8px', fontSize: '14px' }}
                onClick={() => handleDelete(program.id)}
                whileTap={{ scale: 0.98 }}
              >
                Delete
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {showModal && (
        <motion.div
          className="modal"
          onClick={() => setShowModal(false)}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 28 }}
          >
            <div className="modal-header">
              <h2>Add New Program</h2>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="input-group">
              <label>Program Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Program name"
              />
            </div>
            <div className="input-group">
              <label>Type</label>
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              >
                <option value="Fitness">Fitness</option>
                <option value="Mental Health">Mental Health</option>
                <option value="Nutrition">Nutrition</option>
                <option value="General Wellness">General Wellness</option>
              </select>
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Program description"
                rows="4"
              />
            </div>
            <div className="input-group">
              <label>Duration (e.g. 4 weeks)</label>
              <input
                type="text"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="4 weeks"
              />
            </div>
            <div className="input-group">
              <label>Start date</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>
            <motion.button
              type="button"
              className="btn btn-primary"
              onClick={handleAdd}
              style={{ width: '100%' }}
              whileTap={{ scale: 0.99 }}
            >
              Add Program
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default WellnessPrograms
