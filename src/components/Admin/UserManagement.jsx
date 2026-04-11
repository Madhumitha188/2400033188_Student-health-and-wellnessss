import React, { useCallback, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { api } from '../../api/client'

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState('')

  const load = useCallback(async () => {
    setErr('')
    try {
      const data = await api('/api/admin/users')
      setUsers(Array.isArray(data) ? data : [])
    } catch (e) {
      setErr(e.message || 'Failed to load users')
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
        <p style={{ color: 'var(--text-muted)' }}>Loading users...</p>
      </motion.div>
    )
  }

  return (
    <motion.div className="card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      {err && <div className="login-error">{err}</div>}
      <h2>Registered users</h2>
      <p style={{ color: 'var(--text-muted)', marginTop: 8 }}>All student/admin accounts in local MySQL.</p>
      <table className="table" style={{ marginTop: 20 }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Created</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ textAlign: 'center', color: 'var(--text-muted)' }}>No users found.</td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.phone || '-'}</td>
                <td>{u.role}</td>
                <td>{u.createdAt ? new Date(u.createdAt).toLocaleString() : '-'}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </motion.div>
  )
}

export default UserManagement
