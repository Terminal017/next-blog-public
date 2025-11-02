import { motion } from 'motion/react'
import { useState } from 'react'

export function MessageRemind({
  state,
  setState,
}: {
  state: { ok: boolean; message: string }
  setState: React.Dispatch<
    React.SetStateAction<{ ok: boolean; message: string }>
  >
}) {
  return (
    <motion.div
      className={`bg-third-container fixed top-14 left-1/2 z-200
  flex -translate-x-1/2 flex-col items-center
  gap-4 rounded-md px-12 py-4 shadow-xl`}
      initial={{ opacity: 0, y: -64 }}
      animate={{ opacity: state.ok ? 1 : 0, y: state.ok ? 0 : -64 }}
      transition={{ duration: 0.3, ease: state.ok ? 'easeOut' : 'easeIn' }}
      onClick={() =>
        setState((prev) => {
          return { ok: false, message: prev.message }
        })
      }
    >
      <p className="cursor-default text-xl whitespace-nowrap">
        {state.message}
      </p>
    </motion.div>
  )
}

//激活提示的自定义Hook
