import "@/styles/about.css";
import { inter } from "@/ui/font";

export default function About() {
  return (
    <main id="about">
      <div className="about-header">
        <h1 className={inter.className}>About</h1>
      </div>
      <article className="about-container">
        <h2>关于本站</h2>
        <p>这里是星轨的前哨基地，基地已开放所有探索的权限。</p>
        <h2>关于星轨</h2>
        <TableAbout />
        <h2>连接星轨</h2>
        <ContactLink />
      </article>
    </main>
  );
}

function TableAbout() {
  return (
    <div className="table-infor">
      <table>
        <thead>
          <tr>
            <th>元素</th>
            <th>描述</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>生日</td>
            <td>2004/10/18</td>
          </tr>
          <tr>
            <td>特征</td>
            <td>日常自动生产bug&#xFF0C;需要经常维修和更新</td>
          </tr>
          <tr>
            <td>从事</td>
            <td>计算机科班大二学牲</td>
          </tr>
          <tr>
            <td>爱好</td>
            <td>RTS游戏&#xFF0C;听纯音乐&#xFF0C;开发新东西</td>
          </tr>
          <tr>
            <td>理想</td>
            <td>建造控制中心</td>
          </tr>
          <tr>
            <td>理想</td>
            <td>建造控制中心</td>
          </tr>
          <tr>
            <td>喜欢的食物</td>
            <td>ice cream&#xFF0C;coffee</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

function ContactLink() {
  return (
    <div className="contact-list">
      <a
        href="https://github.com/Terminal017"
        target="_blank"
        rel="noopener noreferrer"
        className="contact-item1"
      >
        <div className="contact-box">
          <span className={"font-bold text-lg text-white"}>Github</span>
          <svg
            height="512px"
            id="Layer_1"
            style={{ enableBackground: "new 0 0 512 512" }}
            version="1.1"
            viewBox="0 0 512 512"
            width="512px"
            xmlSpace="preserve"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            className="h-10 w-10"
          >
            <style type="text/css">
              {`
              .st0{fill-rule:evenodd;clip-rule:evenodd;fill:#fff;}
            `}
            </style>
            <g>
              <path
                className="st0"
                d="M256,32C132.3,32,32,134.8,32,261.7c0,101.5,64.2,187.5,153.2,217.9c11.2,2.1,15.3-5,15.3-11.1  c0-5.5-0.2-19.9-0.3-39.1c-62.3,13.9-75.5-30.8-75.5-30.8c-10.2-26.5-24.9-33.6-24.9-33.6c-20.3-14.3,1.5-14,1.5-14  c22.5,1.6,34.3,23.7,34.3,23.7c20,35.1,52.4,25,65.2,19.1c2-14.8,7.8-25,14.2-30.7c-49.7-5.8-102-25.5-102-113.5  c0-25.1,8.7-45.6,23-61.6c-2.3-5.8-10-29.2,2.2-60.8c0,0,18.8-6.2,61.6,23.5c17.9-5.1,37-7.6,56.1-7.7c19,0.1,38.2,2.6,56.1,7.7  c42.8-29.7,61.5-23.5,61.5-23.5c12.2,31.6,4.5,55,2.2,60.8c14.3,16.1,23,36.6,23,61.6c0,88.2-52.4,107.6-102.3,113.3  c8,7.1,15.2,21.1,15.2,42.5c0,30.7-0.3,55.5-0.3,63c0,6.1,4,13.3,15.4,11C415.9,449.1,480,363.1,480,261.7  C480,134.8,379.7,32,256,32z"
              />
            </g>
          </svg>
        </div>
      </a>
      <a
        href="mailto:wni387005@gmail.com"
        rel="noopener noreferrer"
        className="contact-item2"
      >
        <div className="contact-box">
          <span className={"font-bold text-lg text-white"}>Email</span>
          <svg
            role="img"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            fill="#ffffff"
            className="h-10 w-10"
          >
            <title>Gmail</title>
            <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
          </svg>
        </div>
      </a>
      <p></p>
    </div>
  );
}
