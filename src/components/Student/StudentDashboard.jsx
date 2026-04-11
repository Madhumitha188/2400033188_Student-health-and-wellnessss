import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { api } from '../../api/client'
import Resources from './Resources'
import WellnessPrograms from './WellnessPrograms'
import SupportServices from './SupportServices'
import TabBar from '../Shared/TabBar'
import './StudentDashboard.css'

const items = [
  { id: 'resources', label: 'Health Resources' },
  { id: 'programs', label: 'Wellness Programs' },
  { id: 'support', label: 'Support' },
]

const StudentDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('resources')
  const [showProfile, setShowProfile] = useState(false)
  const [name, setName] = useState(user?.name || '')
  const [phone, setPhone] = useState('')
  const [saving, setSaving] = useState(false)
  const [profileMsg, setProfileMsg] = useState('')

  const saveProfile = async () => {
    setSaving(true)
    setProfileMsg('')
    try {
      await api('/api/users/me', {
        method: 'PUT',
        body: JSON.stringify({ name: name.trim(), phone: phone.trim() }),
      })
      setProfileMsg('Profile updated successfully.')
      window.setTimeout(() => setShowProfile(false), 900)
    } catch (e) {
      setProfileMsg(e.message || 'Could not update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="student-dashboard">
      <div className="container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>Welcome back, {user.name}</h1>
          <p>Explore resources, join programs, and get support — all in one calm, focused space.</p>
          <button type="button" className="btn btn-secondary" style={{ marginTop: 12 }} onClick={() => setShowProfile(true)}>
            Add / Edit profile
          </button>
        </motion.div>

        <TabBar items={items} value={activeTab} onChange={setActiveTab} layoutIdPrefix="student" />

        <div className="tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
            >
              {activeTab === 'resources' && <Resources />}
              {activeTab === 'programs' && <WellnessPrograms />}
              {activeTab === 'support' && <SupportServices />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
      {showProfile && (
        <div className="modal" onClick={() => setShowProfile(false)} role="presentation">
          <div className="modal-content" onClick={(e) => e.stopPropagation()} role="dialog">
            <div className="modal-header">
              <h2>Update profile</h2>
              <button type="button" className="close-btn" onClick={() => setShowProfile(false)}>
                ×
              </button>
            </div>
            {profileMsg && <div className={profileMsg.includes('success') ? 'toast-success' : 'login-error'}>{profileMsg}</div>}
            <div className="input-group">
              <label>Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="input-group">
              <label>Phone number</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            <button type="button" className="btn btn-primary" style={{ width: '100%' }} disabled={saving} onClick={saveProfile}>
              {saving ? 'Saving…' : 'Save profile'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default StudentDashboard
