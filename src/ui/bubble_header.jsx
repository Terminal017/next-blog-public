"use client"

import "@/styles/ani/bubble.css"
import { motion } from "motion/react"
import { useEffect, useState, useCallback, useRef } from "react"

export default function BubbleHeader({ content, width }) {
  const [bubbles, setBubbles] = useState([])
  const [isHoveringbox, setIsHoveringbox] = useState(false)
  const hoverTimerRef = useRef(null) //设置定时器，控制动画切换延迟

  const hoverDelay = 1000
  const maxcount = width

  const handleHoverChange = useCallback(
    (isHovering) => {
      // 清除之前的定时器，防止多次触发
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }

      hoverTimerRef.current = setTimeout(() => {
        setIsHoveringbox(isHovering)
      }, hoverDelay)
    },
    [hoverDelay]
  )

  // 创建重置气泡函数，使用useCallback以保证函数引用相同（稳定）
  const resetBubble = useCallback((id, add = 0) => {
    setBubbles((current) =>
      current.map((bubble) => {
        if (bubble.id === id) {
          return {
            ...bubble,
            id: bubble.id,
            size: Math.random() * 12 + 10,
            left: Math.random() * 100,
            delay: Math.random() * 0.25 + add, //add控制首次气泡进入的速度，使其逐段增加
            duration: Math.random() * 0.5 + 0.2,
            xTarget: Math.random() * 60 - 30,
            yTarget: -130,
            reset: !bubble.reset, //调整reset状态
          }
        }
        return bubble
      })
    )
  }, [])

  // 初始化气泡
  useEffect(() => {
    const newBubbles = []

    //页面初始化时会挂载一次
    for (let i = 0; i < maxcount; i++) {
      newBubbles.push({
        id: i,
        size: Math.random() * 12 + 10,
        left: Math.random() * 100,
        delay: Math.random() * 0.1, // 初始气泡有随机延迟
        duration: Math.random() * 0.5 + 0.2,
        xTarget: Math.random() * 120 - 60,
        yTarget: 0,
        reset: false, //reset状态，用于与原气泡组件区分
      })
    }

    setBubbles(newBubbles)
    //卸载时清理防抖定时器
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // 当isHoveringbox状态变化时，为下一次动画设置逐段delay
    setBubbles((current) =>
      current.map((bubble, index) => {
        if (isHoveringbox) {
          return {
            ...bubble,
            yTarget: 130,
            delay: Math.random() * 0.5 + (index % 10) * 0.75, // 逐段增加动画延迟
          }
        } else {
          return {
            ...bubble,
          }
        }
      })
    )
  }, [isHoveringbox])

  return (
    <div
      className="bubble-box bg-primary-container"
      style={{ width: `${width}rem` }} // 设置最大宽度
      onMouseEnter={() => handleHoverChange(true)} // 鼠标进入时设置状态为true
      onMouseLeave={() => handleHoverChange(false)} // 鼠标离开时设置状态为false
    >
      <h1 className="text-on-primary-container">{content}</h1>
      <div className="bubbles-container">
        {bubbles.map((bubble) => (
          <motion.div
            key={`${bubble.id}-${bubble.reset}`} // 使用复合key确保动画重置
            className="motion-bubble"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.left}%`,
              bottom: -30,
            }}
            //初始位置
            initial={{
              x: 0,
              y: 0, //y轴偏移量
              opacity: 0.8,
            }}
            //动画结束位置
            animate={{
              x: bubble.xTarget,
              y: bubble.yTarget,
              opacity: 0,
            }}
            //持续时间和延迟
            transition={{
              duration: bubble.duration,
              delay: bubble.delay,
              ease: "easeInOut",
            }}
            // 动画完成后，如果在isHoveringbox状态下，就重设动画
            onAnimationComplete={() => {
              if (isHoveringbox) {
                resetBubble(bubble.id)
              }
            }}
          />
        ))}
      </div>
    </div>
  )
}
