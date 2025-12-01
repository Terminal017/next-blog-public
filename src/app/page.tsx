'use client'

import '@/styles/home_page.css'
import HomePage from './base_content'
import ApertureDark from '@/components/animation/aperture_dark' //导入主页动画组件
import ApertureLight from '@/components/animation/aperture_light'
import { AnimatePresence } from 'motion/react'
import { useState, useEffect } from 'react'

export default function Home() {
  const [theme, setTheme] = useState(false)

  //检测深浅模式的变化，以更替主页动画
  useEffect(() => {
    setTheme(document.documentElement.className === 'dark')

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.className === 'dark')
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class'],
    })

    // 退出页面停止检测
    return () => observer.disconnect()
  }, [])

  return (
    <div className="base">
      <HomePage />
      {/* 切换动画 */}
      <AnimatePresence>
        {theme ? <ApertureDark key="dark" /> : <ApertureLight key="light" />}
      </AnimatePresence>
    </div>
  )
}
