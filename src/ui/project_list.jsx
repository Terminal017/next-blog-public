import BubbleHeader from "@/ui/bubble_header";
import "@/styles/plist.css";

export default function ProjectsList() {
  let data_list = [];
  data_list.push({
    link: "https://react.dev/",
    img: "./images/A1.png",
    title: "Project 1",
    desc: "Description of project 1",
    tags: ["#React", "#JavaScript"],
  });

  return (
    <main id="projects">
      <BubbleHeader content="Project" maxwidth={66} />
      <div className="flex flex-col justify-center items-center w-9/10 max-w-[66rem] h-16 mt-8 rounded-sm bg-amber-200 hover:-translate-y-1 hover:scale-101">
        <p className="font-bold text-xl font-sans">这里一片荒芜！</p>
      </div>
      {/* <div className="plist-container">
        <ProjectBox data={data_list[0]} />
        <ProjectBox />
        <ProjectBox />
        <ProjectBox />
      </div> */}
    </main>
  );
}

export function ProjectBox({ data }) {
  return (
    <div className="plist-box">
      <a href={data.link} target="_blank" className="plist-box-link">
        <div className="plist-box-img">
          <img src="./images/P1.png" alt="项目1" />
        </div>
        <div>
          <h2>{data.title}</h2>
          <p>{data.desc}</p>
          <div>
            {data.tags.map((tag) => {
              return <div key={tag}>{tag}</div>;
            })}
          </div>
        </div>
      </a>
    </div>
  );
}
