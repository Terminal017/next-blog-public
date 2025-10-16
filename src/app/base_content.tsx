'use client'
import { motion } from 'motion/react'
import Image from 'next/image'

export default function HomePage() {
  return (
    <>
      <motion.div
        className="avatar_container"
        initial={{ opacity: 0, scale: 0.3, y: -30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 20,
          mass: 2,
          bounce: 0.4,
          delay: 0.2,
        }}
      >
        {/* <img src="/images/avatar.webp" /> */}
        <Image
          src="/images/avatar.webp"
          alt="星轨的头像"
          width={200}
          height={200}
          unoptimized
          priority
        />
      </motion.div>
      <motion.div
        className="base-text"
        initial={{ opacity: 0, transform: 'translateY(70px)' }}
        animate={{ opacity: 1, transform: 'translateY(0px)' }}
        transition={{
          type: 'spring',
          stiffness: 60,
          damping: 20,
          mass: 2,
          bounce: 0.4,
          delay: 0.2,
        }}
      >
        <span>
          这里是
          <button className="special-text">星轨</button>
          的基地
        </span>
      </motion.div>
    </>
  )
}
