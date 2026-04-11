import React from 'react'
import { motion } from 'framer-motion'

/**
 * @param {{ id: string, label: string }[]} items
 * @param {string} layoutIdPrefix - unique per dashboard so student vs admin don’t clash
 */
export default function TabBar({ items, value, onChange, layoutIdPrefix = 'tab' }) {
  return (
    <div className="tabs">
      {items.map((item) => {
        const isActive = value === item.id
        return (
          <button
            key={item.id}
            type="button"
            className={`tab ${isActive ? 'active' : ''}`}
            onClick={() => onChange(item.id)}
            style={{ position: 'relative', overflow: 'hidden' }}
          >
            {isActive && (
              <motion.div
                className="tab-pill-indicator"
                layoutId={`${layoutIdPrefix}-pill`}
                transition={{ type: 'spring', stiffness: 420, damping: 32 }}
              />
            )}
            <span style={{ position: 'relative', zIndex: 1 }}>{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
