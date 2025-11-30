import { motion } from 'motion/react'
import { AnimatePresence } from 'motion/react'
import { useState } from 'react'

export function MessageRemind({
  state,
  setState,
}: {
  state: { id: string; message: string }[]
  setState: React.Dispatch<
    React.SetStateAction<{ id: string; message: string }[]>
  >
}) {
  return (
    <AnimatePresence>
      {state.map((item) => {
        return (
          <motion.div
            key={item.id}
            className={`bg-third-container fixed top-14 left-1/2 z-200
    flex -translate-x-1/2 flex-col items-center
    gap-4 rounded-md px-12 py-4 shadow-xl`}
            initial={{ opacity: 0, y: -64 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: {
                duration: 0.3,
                ease: 'easeOut',
              },
            }}
            exit={{
              opacity: 0,
              y: -64,
              transition: {
                duration: 0.3,
                ease: 'easeIn',
              },
            }}
            onClick={() =>
              setState((prev) => prev.filter((mes) => mes.id !== item.id))
            }
          >
            <p className="cursor-default text-xl whitespace-nowrap">
              {item.message}
            </p>
          </motion.div>
        )
      })}
    </AnimatePresence>
  )
}

//激活提示的自定义Hook
export function useMessage() {
  const [message, setMessage] = useState<{ id: string; message: string }[]>([])

  function sendMessage(message: string) {
    const message_id = crypto.randomUUID()
    setMessage((prev) => {
      const new_message = { id: message_id, message: message }
      return [...prev, new_message]
    })
    setTimeout(() => {
      setMessage((prev) => prev.filter((item) => item.id !== message_id))
    }, 3000)
  }

  return { message, setMessage, sendMessage }
}
