'use client'

export default function Message_check({
  message,
  onConfirm,
  onCancel,
}: {
  message: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
}) {
  return (
    <div
      className="bg-background/50 fixed top-0 left-0 z-50 flex h-full w-full
    items-center justify-center"
    >
      <div
        className="bg-surface-high flex flex-col items-center gap-4 
        rounded-sm px-10 pt-8 pb-6 shadow-lg"
      >
        <p className="max-w-[14rem] cursor-default text-xl font-medium">
          {message}
        </p>
        <div className="flex w-full flex-row justify-around gap-4 text-lg">
          <button
            onClick={onCancel}
            className="hover:bg-primary/50 border-outline-v rounded-sm border px-4
          py-1 transition-colors duration-200 ease-in-out"
          >
            取消
          </button>
          <button
            onClick={onConfirm}
            className="hover:bg-primary/50 border-outline-v rounded-sm border px-4
          py-1 transition-colors duration-200 ease-in-out"
          >
            确认
          </button>
        </div>
      </div>
    </div>
  )
}
