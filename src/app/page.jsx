"use client"

import "@/styles/home_page.css"
import HomePage from "./base-content"
import ApertureDark from "@/ui/animation/aperture_dark"
import ApertureLight from "@/ui/animation/aperture_light"
import { motion, AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"

export default function Home() {
  const [theme, setTheme] = useState("false")

  useEffect(() => {
    setTheme(document.documentElement.className === "dark")

    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.className === "dark")
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  })
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
