'use client'

import BubbleHeader from '@/ui/bubble_header'
import { useState } from 'react'
import { motion } from 'motion/react'

interface friendlinkType {
  title: string
  site: string
  avatar: string
  description: string
  email: string
  datetime: Date
}

export default function FriendLinkList({
  friendlink_data,
}: {
  friendlink_data: friendlinkType[]
}) {
  return (
    <main className="flex w-full flex-col items-center">
      <BubbleHeader content="Friend Links" width={45}></BubbleHeader>
      <FriendLinkForm />
      <div
        className="mt-12 grid w-[45rem] max-w-4/5 grid-cols-2
      gap-8 max-md:max-w-9/10"
      >
        {friendlink_data.map((item, index) => {
          return (
            <a
              href={item.site}
              target="_blank"
              className="bg-surface-low dark:bg-surface-high hover:border-primary 
               group flex flex-row rounded-2xl border-[2.5px] border-solid
               border-transparent px-6 py-5 shadow-md transition-all duration-300
               ease-linear  hover:scale-101"
              key={index}
            >
              <div className="flex flex-row items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center">
                  <img
                    src={item.avatar}
                    alt="网站头像"
                    className="group-hover:border-primary h-full w-full rounded-full
                    border-[2.5px] border-solid border-transparent object-cover
                    transition-all duration-300 ease-linear"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <h3
                    className="text-on-surface group-hover:text-primary 
                  text-lg font-medium"
                  >
                    {item.title}
                  </h3>
                  <p className="text-on-surface-v text-sm">
                    {item.description}
                  </p>
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </main>
  )
}

export function FriendLinkForm() {
  const [toggles, setToggles] = useState(0)

  return <div className="h-10 w-full bg-amber-300"></div>
}
