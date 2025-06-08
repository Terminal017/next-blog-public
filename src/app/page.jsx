"use client"

import "@/styles/home_page.css"
import HomePage from "./base_content"
import ApertureDark from "@/ui/animation/aperture_dark"
import ApertureLight from "@/ui/animation/aperture_light"
import { AnimatePresence } from "motion/react"
import { useState, useEffect } from "react"
import { motion } from "motion/react"

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
    <motion.div
      className="base"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <HomePage />
      {/* 切换动画 */}
      <AnimatePresence>
        {theme ? <ApertureDark key="dark" /> : <ApertureLight key="light" />}
      </AnimatePresence>
    </motion.div>
  )
}
