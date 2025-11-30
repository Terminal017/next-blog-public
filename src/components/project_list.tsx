import BubbleHeader from '@/components/bubble_header'
import '@/styles/plist.css'
import Image from 'next/image'
import type { ProjectsDataProps } from '@/components/type'

export default function ProjectsList() {
  const data_list: ProjectsDataProps[] = []
  data_list.push({
    link: 'https://react.dev/',
    img: './images/A1.png',
    title: 'Project 1',
    desc: 'Description of project 1',
    tags: ['#React', '#JavaScript'],
  })

  return (
    <main id="projects">
      <BubbleHeader content="Project" width={66} />
      <div className="mt-8 flex h-16 w-9/10 max-w-[66rem] flex-col items-center justify-center rounded-sm bg-amber-200 hover:-translate-y-1 hover:scale-101">
        <p className="font-sans text-xl font-bold">这里一片荒芜！</p>
      </div>
      {/* <div className="plist-container">
        <ProjectBox data={data_list[0]} />
        <ProjectBox />
        <ProjectBox />
        <ProjectBox />
      </div> */}
    </main>
  )
}

export function ProjectBox({ data }: { data: ProjectsDataProps }) {
  return (
    <div className="plist-box">
      <a href={data.link} target="_blank" className="plist-box-link">
        <div className="plist-box-img">
          <Image src="./images/P1.png" alt="项目1" />
        </div>
        <div>
          <h2>{data.title}</h2>
          <p>{data.desc}</p>
          <div>
            {data.tags.map((tag: string) => {
              return <div key={tag}>{tag}</div>
            })}
          </div>
        </div>
      </a>
    </div>
  )
}
