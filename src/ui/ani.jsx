function Launcher() {
  return (
    <svg
      width={60}
      height={60}
      viewBox="0 0 60 60"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 正方形底座 - 深色科技感 */}
      <rect
        x="5"
        y="5"
        width="50"
        height="50"
        rx="4"
        fill="rgb(45 55 72)"
        stroke="var(--md-sys-color-primary)"
        strokeWidth="2"
      />

      {/* 外圈空心圆 - 亮蓝色 */}
      <circle
        cx="30"
        cy="30"
        r="20"
        fill="none"
        stroke="rgb(59 130 246)"
        strokeWidth="3"
      />

      {/* 内圈实心圆 - 银白金属色 */}
      <circle
        cx="30"
        cy="30"
        r="10"
        fill="rgb(203 213 225)"
        stroke="rgb(148 163 184)"
        strokeWidth="1"
      />
    </svg>
  );
}
