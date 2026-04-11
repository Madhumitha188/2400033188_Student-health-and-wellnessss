import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { loginRequest, signupRequest } from '../../api/client'
import './Login.css'

const Login = ({ onLogin }) => {
  const [mode, setMode] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data =
        mode === 'login'
          ? await loginRequest(email.trim(), password)
          : await signupRequest({ email: email.trim(), password, name: name.trim(), phone: phone.trim() })
      onLogin({
        token: data.token,
        email: data.email,
        name: data.name,
        role: data.role,
      })
    } catch (err) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: 24, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 280, damping: 28 }}
      >
        <div className="login-header">
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            Student Health & Wellness
          </motion.h1>
          <p>{mode === 'login' ? 'Sign in with your campus account' : 'Create your student account'}</p>
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}
          {mode === 'signup' && (
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your full name"
                required
              />
            </div>
          )}
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@wellness.edu or student@wellness.edu"
              required
              autoComplete="username"
            />
          </div>
          {mode === 'signup' && (
            <div className="input-group">
              <label>Phone number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit phone number"
              />
            </div>
          )}
          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              autoComplete="current-password"
            />
          </div>
          <motion.button
            type="submit"
            className="btn btn-primary login-btn"
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? 'Please wait…' : mode === 'login' ? 'Login' : 'Sign up'}
          </motion.button>
          <motion.button
            type="button"
            className="btn btn-secondary login-btn"
            onClick={() => {
              setMode((m) => (m === 'login' ? 'signup' : 'login'))
              setError('')
            }}
            disabled={loading}
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            style={{ marginTop: 8 }}
          >
            {mode === 'login' ? 'New user? Sign up' : 'Already have an account? Login'}
          </motion.button>
          <p className="demo-note">
            Default users (after API seed): <strong>admin@wellness.edu</strong> /{' '}
            <strong>student@wellness.edu</strong> — password: <strong>password</strong>
          </p>
        </form>
      </motion.div>
    </div>
  )
}

export default Login
