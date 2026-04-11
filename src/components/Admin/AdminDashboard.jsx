import React, { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import ResourceManagement from './ResourceManagement'
import WellnessPrograms from './WellnessPrograms'
import UsageMetrics from './UsageMetrics'
import SupportInbox from './SupportInbox'
import UserManagement from './UserManagement'
import TabBar from '../Shared/TabBar'
import './AdminDashboard.css'

const items = [
  { id: 'resources', label: 'Health Resources' },
  { id: 'programs', label: 'Programs' },
  { id: 'users', label: 'Users' },
  { id: 'metrics', label: 'Usage Metrics' },
  { id: 'support', label: 'Support Inbox' },
]

const AdminDashboard = ({ user }) => {
  const [activeTab, setActiveTab] = useState('resources')

  return (
    <div className="admin-dashboard">
      <div className="container">
        <motion.div
          className="dashboard-header"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1>Admin command center</h1>
          <p>
            {user?.name ? `Hi ${user.name} — ` : ''}
            Manage catalog, programs, analytics, and support requests.
          </p>
        </motion.div>

        <TabBar items={items} value={activeTab} onChange={setActiveTab} layoutIdPrefix="admin" />

        <div className="tab-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.22 }}
            >
              {activeTab === 'resources' && <ResourceManagement />}
              {activeTab === 'programs' && <WellnessPrograms />}
              {activeTab === 'users' && <UserManagement />}
              {activeTab === 'metrics' && <UsageMetrics />}
              {activeTab === 'support' && <SupportInbox />}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
