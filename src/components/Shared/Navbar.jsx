import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import './Navbar.css'

const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate()

  const handleLogout = () => {
    onLogout()
    navigate('/')
  }

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 320, damping: 30 }}
    >
      <div className="navbar-container">
        <div className="navbar-brand">
          <h2>Vitality Campus</h2>
        </div>
        <div className="navbar-menu">
          <span className="user-info">
            {user.name} · {user.role === 'admin' ? 'Admin' : 'Student'}
          </span>
          <motion.button
            type="button"
            onClick={handleLogout}
            className="btn btn-secondary logout-btn"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
          >
            Logout
          </motion.button>
        </div>
      </div>
    </motion.nav>
  )
}

export default Navbar
