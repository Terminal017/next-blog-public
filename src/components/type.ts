// 深色模式下动画类型
export interface ApertureDarkType {
  x: number
  y: number
  r: number
  key: string
  delay: number
  duration: number
  width: number
}

// 浅色模式下动画类型
export interface ApertureLightType {
  x: number
  y: number
  r: number
  key: string
  radius: string
}

// 气泡动画中气泡数据类型
export interface BubbleType {
  id: number
  size: number
  left: number
  delay: number
  duration: number
  xTarget: number
  yTarget: number
  reset: boolean
}

// 项目列表数据类型
export interface ProjectsDataProps {
  link: string
  img: string
  title: string
  desc: string
  tags: string[]
}
