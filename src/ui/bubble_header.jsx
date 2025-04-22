"use client";

import "@/styles/ani/bubble.css";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback, useRef } from "react";

export default function BubbleHeader() {
  const [bubbles, setBubbles] = useState([]);
  const [isHoveringbox, setIsHoveringBox] = useState(false);
  const hoverTimerRef = useRef(null); //设置定时器，控制动画切换延迟

  //解决动画闭包调用问题
  const isHoveringRef = useRef(isHoveringbox);
  useEffect(() => {
    isHoveringRef.current = isHoveringbox;
  }, [isHoveringbox]);

  const hoverDelay = 1000;
  const mincount = 0; // 默认气泡数量，这里预设没有，后续上线时可以优化
  const maxcount = 100;

  const handleHoverChange = useCallback((isHovering) => {
    // 清除之前的定时器，防止多次触发
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
    }

    hoverTimerRef.current = setTimeout(() => {
      setIsHoveringBox(isHovering);
    }, hoverDelay);
  }, []);

  // 创建重置气泡函数，使用useCallback以保证函数引用相同（稳定）
  const resetBubble = useCallback(
    (id, add = 0) => {
      setBubbles((current) =>
        current.map((bubble) => {
          if (bubble.id === id) {
            if (!bubble.isActive) {
              return bubble;
            }
            return {
              id: bubble.id,
              size: hoverTimerRef.current
                ? Math.random() * 12 + 10
                : Math.random() * 10 + 200,
              left: Math.random() * 100,
              delay: hoverTimerRef.current
                ? Math.random() * 0.5 + add
                : Math.random() * 0.5,
              duration: hoverTimerRef.current
                ? Math.random() * 0.5 + 0.2
                : Math.random() * 3 + 3,
              xTarget: hoverTimerRef.current
                ? Math.random() * 60 - 30
                : Math.random() * 40 - 20,
              yTarget: -130,
              reset: !bubble.reset, //控制reset状态
              isActive: bubble.isActive,
            };
          }
          return bubble;
        })
      );
    },
    [isHoveringbox]
  );

  // 初始化气泡
  useEffect(() => {
    const newBubbles = [];

    for (let i = 0; i < maxcount; i++) {
      //页面初始化时会挂载一次
      newBubbles.push({
        id: i,
        size: Math.random() * 12 + 10,
        left: Math.random() * 100,
        delay: Math.random() * 0.1, // 初始气泡有随机延迟
        duration: Math.random() * 0.1,
        xTarget: (Math.random() * 40 - 20) * 3,
        yTarget: i < mincount ? -130 : 0,
        reset: false, // 用于跟踪重置状态
        isActive: i < mincount, // 控制是否展示
      });
    }

    setBubbles(newBubbles);
    return () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    setBubbles((current) => {
      const updated = current.map((bubble) => {
        return {
          ...bubble,
          isActive: isHoveringbox || bubble.id < mincount,
        };
      });
      updated.forEach((bubble, index) => {
        if (bubble.isActive && !current[index].isActive) {
          resetBubble(bubble.id, (bubble.id % 10) * 1);
        }
      });

      return updated;
    });
  }, [isHoveringbox, mincount]);

  return (
    <div
      className="bubble-box"
      onMouseEnter={() => handleHoverChange(true)} // 鼠标进入时设置状态为true
      onMouseLeave={() => handleHoverChange(false)} // 鼠标离开时设置状态为false
    >
      <h1>Project</h1>
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
            onAnimationComplete={(isHoveringbox) => {
              if (bubble.isActive) {
                resetBubble(bubble.id);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
}
