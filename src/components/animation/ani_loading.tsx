'use client'

import { motion } from 'motion/react'

export function LoadingAni({ width }: { width: number }) {
  return (
    <>
      <motion.div
        className="text-on-surface inline-block"
        style={{ width: width, height: width }}
        initial={{ rotate: 0 }}
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
      >
        <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg">
          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="29.32 146.61"
            transform="rotate(-90 32 32)"
          />

          <circle
            cx="32"
            cy="32"
            r="28"
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray="29.32 146.61"
            transform="rotate(90 32 32)"
          />
        </svg>
      </motion.div>
    </>
  )
}
