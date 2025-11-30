'use client'

import '@/styles/ani/aperture.css'
import { motion, AnimatePresence } from 'motion/react'
import { useState, useEffect, useRef, MouseEvent } from 'react'

import type { ApertureLightType } from '@/components/type'

export default function ApertureLight() {
  const [apertures, setApertures] = useState<ApertureLightType[]>([])
  const timeRef = useRef<NodeJS.Timeout[]>([])

  useEffect(() => {
    return () => {
      timeRef.current.forEach((timeId) => {
        clearTimeout(timeId)
      })
      timeRef.current = []
    }
  }, [])

  const border_list = ['6%', '50%']
  const handleClick = (e: MouseEvent<HTMLDivElement>) => {
    const aperture_item = {
      x: e.clientX,
      y: e.clientY,
      r: 50,
      key: crypto.randomUUID(),
      radius: border_list[Math.floor(Math.random() * border_list.length)],
    }

    setApertures((prev) => [...prev, aperture_item])

    const timeId = setTimeout(() => {
      setApertures((prev) =>
        prev.filter((item) => item.key !== aperture_item.key),
      )
      timeRef.current = timeRef.current.filter((id) => id !== timeId)
    }, 2000)

    timeRef.current.push(timeId)
  }

  return (
    <motion.div
      className="canvas-box"
      onClick={handleClick}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <AnimatePresence>
        {apertures.map((aperture) => {
          return (
            <motion.div
              key={aperture.key}
              className="aperture-item-light"
              style={{
                top: aperture.y - aperture.r,
                left: aperture.x - aperture.r,
                width: aperture.r * 2,
                height: aperture.r * 2,
                borderRadius: aperture.radius,
              }}
              initial={{ opacity: 1, scale: 0 }}
              animate={{ opacity: 0, scale: 1 }}
              transition={{
                duration: 1.5,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            ></motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
