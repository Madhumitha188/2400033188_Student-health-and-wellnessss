import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../api/client'

const SupportServices = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    serviceType: 'General Inquiry',
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      await api('/api/support/requests', {
        method: 'POST',
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          serviceType: formData.serviceType,
          message: formData.message.trim(),
        }),
      })
      setSubmitted(true)
      setFormData({ name: '', email: '', serviceType: 'General Inquiry', message: '' })
      window.setTimeout(() => setSubmitted(false), 5000)
    } catch (error) {
      setErr(error.message || 'Submit failed')
    } finally {
      setLoading(false)
    }
  }

  const supportOptions = [
    {
      title: 'Crisis Support',
      description: '24/7 crisis hotline for immediate mental health support',
      phone: '(555) 123-HELP',
      available: '24/7',
    },
    {
      title: 'Academic Stress Support',
      description: 'Resources and counseling for managing academic pressure',
      email: 'academicsupport@university.edu',
      available: 'Mon-Fri, 9 AM - 5 PM',
    },
    {
      title: 'Health Consultation',
      description: 'Schedule a consultation with health professionals',
      email: 'healthconsult@university.edu',
      available: 'Mon-Fri, 8 AM - 6 PM',
    },
    {
      title: 'Peer Support Groups',
      description: 'Join peer support groups for shared experiences and mutual support',
      email: 'peersupport@university.edu',
      available: 'Various times',
    },
  ]

  return (
    <div>
      <motion.div className="card" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h2>Support Services</h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px', lineHeight: 1.55 }}>
          Reach out using the quick actions below, or send a structured request — we route it to the right team.
        </p>
      </motion.div>

      <div className="grid">
        {supportOptions.map((option, index) => (
          <motion.article
            key={option.title}
            className="resource-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.07 }}
            whileHover={{ y: -5 }}
          >
            <span className="pill">{option.title}</span>
            <h3>{option.title}</h3>
            <p>{option.description}</p>
            <div
              style={{
                marginTop: '16px',
                paddingTop: '16px',
                borderTop: '1px solid var(--border)',
              }}
            >
              {option.phone && (
                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Phone</strong>{' '}
                  <a className="link-inline" href={`tel:${option.phone.replace(/[^\d+]/g, '')}`}>
                    {option.phone}
                  </a>
                </p>
              )}
              {option.email && (
                <p style={{ fontSize: '14px', marginBottom: '6px' }}>
                  <strong style={{ color: 'var(--text-muted)' }}>Email</strong>{' '}
                  <a className="link-inline" href={`mailto:${option.email}`}>
                    {option.email}
                  </a>
                </p>
              )}
              <p style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                <strong>Hours</strong> {option.available}
              </p>
            </div>
            <motion.a
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '16px', display: 'block', textAlign: 'center', textDecoration: 'none' }}
              href={option.phone ? `tel:${option.phone.replace(/[^\d+]/g, '')}` : `mailto:${option.email}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {option.phone ? 'Call now' : 'Email now'}
            </motion.a>
          </motion.article>
        ))}
      </div>

      <motion.div className="card" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2>Request support</h2>
        {submitted ? (
          <motion.div
            style={{
              padding: '24px',
              background: 'rgba(45, 212, 191, 0.12)',
              border: '1px solid rgba(45, 212, 191, 0.35)',
              borderRadius: 14,
              textAlign: 'center',
              color: '#99f6e4',
            }}
            initial={{ scale: 0.96, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <h3 style={{ marginBottom: 8 }}>✓ Request submitted</h3>
            <p style={{ color: 'var(--text-muted)' }}>We will get back to you soon.</p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit}>
            {err && <div className="login-error" style={{ marginBottom: 16 }}>{err}</div>}
            <div className="input-group">
              <label>Your name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter your name"
                required
              />
            </div>
            <div className="input-group">
              <label>Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="Enter your email"
                required
              />
            </div>
            <div className="input-group">
              <label>Service type</label>
              <select
                value={formData.serviceType}
                onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
              >
                <option value="General Inquiry">General Inquiry</option>
                <option value="Mental Health Support">Mental Health Support</option>
                <option value="Fitness Consultation">Fitness Consultation</option>
                <option value="Nutrition Advice">Nutrition Advice</option>
                <option value="Emergency Support">Emergency Support</option>
              </select>
            </div>
            <div className="input-group">
              <label>Message</label>
              <textarea
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Describe your concern or request"
                rows="5"
                required
              />
            </div>
            <motion.button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading} whileTap={{ scale: loading ? 1 : 0.98 }}>
              {loading ? 'Submitting…' : 'Submit request'}
            </motion.button>
          </form>
        )}
      </motion.div>
    </div>
  )
}

export default SupportServices
