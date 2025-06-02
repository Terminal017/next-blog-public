"use client"

import "@/styles/ani/aperture.css"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect, useRef } from "react"

export default function ApertureDark() {
  const [apertures, setApertures] = useState([])
  const [presstime, setPressTime] = useState(0)
  const timeRef = useRef([])

  const handleMouseUp = () => {
    setPressTime(Date.now())
  }

  useEffect(() => {
    return () => {
      timeRef.current.forEach((timeId) => {
        clearTimeout(timeId)
      })
      timeRef.current = []
    }
  }, [])

  const handleMouseDown = (e) => {
    //限制电波数量
    if (apertures.length >= 50) {
      return
    }
    const new_r = (Date.now() - presstime) / 3

    let count_aperture = 1 //电波数量
    let delay_aperture = 0 //电波间隔
    let duration_aperture = 1 //电波动画时间
    let width_aperture = 3 //电波宽度

    if (new_r < 125) {
      count_aperture = 1
      delay_aperture = 0
      duration_aperture = 0.6
    } else if (125 <= new_r && new_r < 225) {
      count_aperture = 3
      delay_aperture = 0.2
      duration_aperture = 1
    } else if (225 <= new_r && new_r <= 325) {
      count_aperture = 5
      delay_aperture = 0.3
      duration_aperture = 1.5
    } else {
      count_aperture = Math.min(5 + Math.round((new_r - 325) / 75), 12) //325时为5个，850最大为12个
      delay_aperture = Math.min(4, 1.2 + (new_r - 325) / 250) //1025时最大，为3s
      duration_aperture = 3
      width_aperture = Math.min(3 + (new_r - 325) * 0.05, 30) //865时最大，为25px
    }

    const aperture_item = {
      x: e.clientX,
      y: e.clientY,
      r: new_r > 40 ? new_r : 40,
    }
    const newItems = []

    for (let i = 0; i < count_aperture; i++) {
      const newItem = {
        ...aperture_item,
        key: crypto.randomUUID(),
        delay: i * delay_aperture,
        duration: duration_aperture,
        width: width_aperture,
      }
      newItems.push(newItem)

      //设定定时器清楚结束动画的电波
      const timeId = setTimeout(
        () =>
          setApertures((prev) => {
            prev.filter((item) => item.key != newItem.key)
            timeRef.current = timeRef.current.filter((id) => id !== timeId)
          }),
        new_r <= 125 //控制时间统一
          ? 6000 + duration_aperture * 1000 + i * delay_aperture * 1000
          : 3500 +
              duration_aperture * 1000 +
              delay_aperture * count_aperture * 1000 +
              i * 300
      )
      timeRef.current.push(timeId)
    }

    setApertures((prev) => [...prev, ...newItems])
  }

  return (
    <motion.div
      className="canvas-box"
      onMouseDown={handleMouseUp}
      onMouseUp={handleMouseDown}
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.8 } }}
    >
      <AnimatePresence>
        {apertures.map((aperture) => {
          return (
            <motion.div
              className="aperture-item"
              key={aperture.key}
              style={{
                position: "absolute",
                top: aperture.y - aperture.r,
                left: aperture.x - aperture.r,
                width: aperture.r * 2,
                height: aperture.r * 2,
                borderRadius: aperture.r * 2,
              }}
              initial={{
                scale: 0,
                opacity: 0,
                borderWidth: aperture.width,
              }}
              animate={{
                scale: 1,
                opacity: 1,
                borderWidth: 3,
              }}
              exit={{
                scale: 1,
                opacity: 0,
                borderWidth: 3,
                transition: {
                  duration: Math.max(1, aperture.duration),
                  ease: "easeOut",
                },
              }}
              transition={{
                scale: {
                  duration: aperture.duration,
                  delay: aperture.delay,
                  ease: aperture.r <= 350 ? "easeInOut" : "easeOut", //控制不同电波的动画曲线
                },
                opacity: {
                  duration: aperture.duration * 0.6,
                  delay: aperture.delay,
                  ease: "easeInOut",
                },
                borderWidth: {
                  duration: aperture.duration * 0.8,
                  delay: aperture.delay,
                  ease: [0.25, 0.46, 0.45, 0.94],
                },
              }}
            ></motion.div>
          )
        })}
      </AnimatePresence>
    </motion.div>
  )
}
