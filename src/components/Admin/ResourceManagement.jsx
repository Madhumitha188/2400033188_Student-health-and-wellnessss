import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../api/client'
import { getTemplateDescription } from '../../constants/resourceTemplates'

const emptyForm = {
  title: '',
  category: 'Mental Health',
  description: '',
  contactEmail: '',
  phone: '',
}

const displayStatus = (s) => (s === 'ACTIVE' ? 'Active' : 'Inactive')

const ResourceManagement = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState(emptyForm)

  const applyCategoryTemplate = useCallback(
    (category, title) => {
      const nextDescription = getTemplateDescription(category, title?.trim() || 'Campus Resource')
      setFormData((prev) => ({ ...prev, description: nextDescription }))
    },
    [setFormData]
  )

  const load = useCallback(async () => {
    setErr('')
    try {
      const data = await api('/api/admin/resources')
      setResources(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Failed to load resources')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const handleAdd = async () => {
    if (!formData.title?.trim() || !formData.description?.trim()) return
    setErr('')
    try {
      await api('/api/admin/resources', {
        method: 'POST',
        body: JSON.stringify({
          title: formData.title.trim(),
          category: formData.category,
          description: formData.description.trim(),
          contactEmail: formData.contactEmail?.trim() || null,
          phone: formData.phone?.trim() || null,
        }),
      })
      setFormData(emptyForm)
      setShowModal(false)
      await load()
    } catch (e) {
      setErr(e.message || 'Could not create resource')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this resource?')) return
    setErr('')
    try {
      await api(`/api/admin/resources/${id}`, { method: 'DELETE' })
      await load()
    } catch (e) {
      setErr(e.message || 'Delete failed')
    }
  }

  const toggleStatus = async (id) => {
    setErr('')
    try {
      await api(`/api/admin/resources/${id}/status`, { method: 'PATCH' })
      await load()
    } catch (e) {
      setErr(e.message || 'Update failed')
    }
  }

  if (loading) {
    return (
      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading resources…</p>
      </motion.div>
    )
  }

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {err && (
        <div className="login-error" style={{ marginBottom: 16 }}>
          {err}
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: 12 }}>
        <h2>Health resources</h2>
        <motion.button type="button" className="btn btn-primary" onClick={() => setShowModal(true)} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          + Add resource
        </motion.button>
      </div>
      <p style={{ color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.5 }}>
        Contact columns feed the student app — use real emails/phones so “Contact” and mailto links work end-to-end.
      </p>

      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Description</th>
              <th>Contact</th>
              <th>Phone</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {resources.map((resource) => (
              <tr key={resource.id}>
                <td>{resource.id}</td>
                <td>{resource.title}</td>
                <td>{resource.category}</td>
                <td style={{ maxWidth: 220, whiteSpace: 'pre-wrap' }}>{resource.description}</td>
                <td>
                  {resource.contact ? (
                    <a className="link-inline" href={`mailto:${resource.contact}`}>
                      {resource.contact}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {resource.phone ? (
                    <a className="link-inline" href={`tel:${String(resource.phone).replace(/\s/g, '')}`}>
                      {resource.phone}
                    </a>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  <span
                    style={{
                      color: resource.status === 'ACTIVE' ? '#5eead4' : '#fb7185',
                      fontWeight: '600',
                    }}
                  >
                    {displayStatus(resource.status)}
                  </span>
                </td>
                <td>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ marginRight: '8px', padding: '8px 12px', fontSize: '13px' }}
                    onClick={() => toggleStatus(resource.id)}
                  >
                    {resource.status === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button type="button" className="btn btn-danger" style={{ padding: '8px 12px', fontSize: '13px' }} onClick={() => handleDelete(resource.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="modal" onClick={() => setShowModal(false)} role="presentation">
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="modal-header">
              <h2>Add New Resource</h2>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
                ×
              </button>
            </div>
            <div className="input-group">
              <label>Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Resource title"
              />
            </div>
            <div className="input-group">
              <label>Category</label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const nextCategory = e.target.value
                  setFormData((prev) => {
                    const shouldAutoTemplate = !prev.description || prev.description.trim().length < 10
                    if (!shouldAutoTemplate) return { ...prev, category: nextCategory }
                    return {
                      ...prev,
                      category: nextCategory,
                      description: getTemplateDescription(nextCategory, prev.title || 'Campus Resource'),
                    }
                  })
                }}
              >
                <option value="Mental Health">Mental Health</option>
                <option value="Fitness">Fitness</option>
                <option value="Nutrition">Nutrition</option>
                <option value="General Wellness">General Wellness</option>
              </select>
            </div>
            <div style={{ marginTop: -6, marginBottom: 14 }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => applyCategoryTemplate(formData.category, formData.title)}
              >
                Use category template for description
              </button>
            </div>
            <div className="input-group">
              <label>Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Resource description"
                rows="11"
              />
            </div>
            <div className="input-group">
              <label>Contact email (optional)</label>
              <input
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                placeholder="resource@school.edu"
              />
            </div>
            <div className="input-group">
              <label>Phone (optional)</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="(555) 000-0000"
              />
            </div>
            <button type="button" className="btn btn-primary" onClick={handleAdd} style={{ width: '100%' }}>
              Add Resource
            </button>
          </div>
        </div>
      )}
    </motion.div>
  )
}

export default ResourceManagement
