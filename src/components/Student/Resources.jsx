import React, { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { api, apiPostJson } from '../../api/client'
import { getResourceExperience } from '../../constants/resourceTemplates'

const copyText = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
  } catch {
    /* ignore */
  }
}

const Resources = () => {
  const [resources, setResources] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')
  const [busyId, setBusyId] = useState(null)
  const [successId, setSuccessId] = useState(null)
  const [copied, setCopied] = useState(null)
  const [activeResource, setActiveResource] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const load = useCallback(async () => {
    setErr('')
    try {
      const data = await api('/api/resources')
      setResources(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Could not load resources')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const categories = ['All', 'Mental Health', 'Fitness', 'Nutrition', 'General Wellness']

  const filteredResources =
    selectedCategory === 'All'
      ? resources
      : resources.filter((r) => r.category === selectedCategory)
  const activeExperience = activeResource ? getResourceExperience(activeResource) : null

  const accessResource = async (resource) => {
    setBusyId(resource.id)
    setErr('')
    setSuccessId(null)
    try {
      await apiPostJson(`/api/activity/resources/${resource.id}/access`, {})
      setSuccessId(resource.id)
      setActiveResource(resource)
      window.setTimeout(() => setSuccessId((s) => (s === resource.id ? null : s)), 2800)
    } catch (e) {
      setErr(e.message || 'Could not record access — check that the API is running.')
    } finally {
      setBusyId(null)
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
    <div>
      {err && (
        <motion.div
          className="login-error"
          style={{ marginBottom: 16 }}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {err}
        </motion.div>
      )}
      {successId !== null && (
        <div className="toast-success" role="status">
          Access recorded — thanks for using the wellness hub.
        </div>
      )}

      <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <h2>Health Resources</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: 8, marginBottom: 16 }}>
          Browse offerings and tap <strong>Access resource</strong> to log a visit (helps admins with usage insights).
        </p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {categories.map((cat, i) => (
            <motion.button
              key={cat}
              type="button"
              className={`btn ${selectedCategory === cat ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setSelectedCategory(cat)}
              style={{ padding: '10px 18px', fontSize: '14px' }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </motion.div>

      <div className="grid">
        {filteredResources.map((resource, index) => (
          <motion.article
            key={resource.id}
            className="resource-card"
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06, type: 'spring', stiffness: 260, damping: 26 }}
            whileHover={{ y: -6, transition: { duration: 0.2 } }}
          >
            <span className="pill">{resource.category}</span>
            <h3>{resource.title}</h3>
            <p>{resource.description}</p>
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
              }}
            >
              <p style={{ fontSize: '14px', marginBottom: '8px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                <strong style={{ color: 'var(--text-muted)' }}>Email</strong>{' '}
                {resource.contact ? (
                  <>
                    <a className="link-inline" href={`mailto:${resource.contact}`}>
                      {resource.contact}
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={async () => {
                        await copyText(resource.contact)
                        const key = `e-${resource.id}`
                        setCopied(key)
                        window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000)
                      }}
                    >
                      {copied === `e-${resource.id}` ? 'Copied' : 'Copy'}
                    </button>
                  </>
                ) : (
                  '—'
                )}
              </p>
              <p style={{ fontSize: '14px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8 }}>
                <strong style={{ color: 'var(--text-muted)' }}>Phone</strong>{' '}
                {resource.phone ? (
                  <>
                    <a className="link-inline" href={`tel:${resource.phone.replace(/\s/g, '')}`}>
                      {resource.phone}
                    </a>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      style={{ padding: '4px 10px', fontSize: 12 }}
                      onClick={async () => {
                        await copyText(resource.phone.replace(/\s/g, ''))
                        const key = `p-${resource.id}`
                        setCopied(key)
                        window.setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000)
                      }}
                    >
                      {copied === `p-${resource.id}` ? 'Copied' : 'Copy'}
                    </button>
                  </>
                ) : (
                  '—'
                )}
              </p>
            </div>
            <motion.button
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '18px' }}
              disabled={busyId === resource.id}
              onClick={() => accessResource(resource)}
              whileHover={{ scale: busyId === resource.id ? 1 : 1.02 }}
              whileTap={{ scale: busyId === resource.id ? 1 : 0.98 }}
            >
              {busyId === resource.id ? 'Recording…' : 'Access resource'}
            </motion.button>
            {successId === resource.id && (
              <p style={{ marginTop: 10, fontSize: 13, color: '#5eead4', textAlign: 'center' }}>
                ✓ Logged successfully
              </p>
            )}
          </motion.article>
        ))}
      </div>

      {activeResource && (
        <motion.div
          className="modal"
          onClick={() => setActiveResource(null)}
          role="presentation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            className="modal-content resource-experience-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
          >
            <div className="modal-header">
              <h2>{activeResource.title}</h2>
              <button type="button" className="close-btn" onClick={() => setActiveResource(null)}>
                x
              </button>
            </div>

            <div className="resource-experience-hero">
              <span className="pill">{activeResource.category}</span>
              <h3>{activeExperience.headline}</h3>
              <p>{activeExperience.summary}</p>
            </div>

            <div className="resource-experience-grid">
              <section className="resource-experience-section">
                <h4>Program flow</h4>
                <ol>
                  {activeExperience.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </section>
              <section className="resource-experience-section">
                <h4>Practical tips</h4>
                <ul>
                  {activeExperience.tips.map((tip) => (
                    <li key={tip}>{tip}</li>
                  ))}
                </ul>
              </section>
            </div>

            <section className="resource-experience-section">
              <h4>Resource details from admin</h4>
              <p style={{ marginBottom: 10 }}>{activeResource.description}</p>
              <div className="resource-contact-row">
                {activeResource.contact && (
                  <a className="btn btn-secondary" href={`mailto:${activeResource.contact}`}>
                    Email support
                  </a>
                )}
                {activeResource.phone && (
                  <a
                    className="btn btn-primary"
                    href={`tel:${String(activeResource.phone).replace(/\s/g, '')}`}
                  >
                    Call support
                  </a>
                )}
              </div>
            </section>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}

export default Resources
