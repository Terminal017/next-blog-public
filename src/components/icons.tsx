//核心图标组件
export function CoreIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} h-full w-full`}
    >
      <circle
        cx="100"
        cy="100"
        r="80"
        stroke="currentColor"
        strokeWidth="15"
        fill="none"
      />
      <rect
        x="71"
        y="71"
        width="58"
        height="58"
        fill="none"
        stroke="currentColor"
        strokeWidth="15"
        transform="rotate(45 100 100)"
      />
    </svg>
  )
}
