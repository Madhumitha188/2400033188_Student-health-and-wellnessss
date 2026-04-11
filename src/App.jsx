import React, { useState, useCallback, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './components/Auth/Login'
import AdminDashboard from './components/Admin/AdminDashboard'
import StudentDashboard from './components/Student/StudentDashboard'
import Navbar from './components/Shared/Navbar'
import { clearAuth, getStoredAuth, saveAuth } from './api/client'
import './App.css'

function normalizeUserFromStorage() {
  const a = getStoredAuth()
  if (!a?.token) return null
  return {
    email: a.email,
    name: a.name,
    role: String(a.role || '').toLowerCase(),
    token: a.token,
  }
}

function App() {
  const [user, setUser] = useState(() => normalizeUserFromStorage())

  const handleLogin = useCallback((payload) => {
    const role = String(payload.role || '').toLowerCase()
    const next = {
      email: payload.email,
      name: payload.name,
      role,
      token: payload.token,
    }
    saveAuth({ token: payload.token, email: payload.email, name: payload.name, role: payload.role })
    setUser(next)
  }, [])

  const handleLogout = useCallback(() => {
    clearAuth()
    setUser(null)
  }, [])

  useEffect(() => {
    const onLost = () => setUser(null)
    window.addEventListener('wellness-auth-lost', onLost)
    return () => window.removeEventListener('wellness-auth-lost', onLost)
  }, [])

  return (
    <Router>
      <div className="App">
        {user && <Navbar user={user} onLogout={handleLogout} />}
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                <Navigate to={user.role === 'admin' ? '/admin' : '/student'} replace />
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/admin"
            element={
              user?.role === 'admin' ? (
                <AdminDashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/student"
            element={
              user?.role === 'student' ? (
                <StudentDashboard user={user} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App
