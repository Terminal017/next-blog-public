import "@/styles/home_page.css";

export default function Home() {
  return (
    <div className="base">
      <div className="avatar_container">
        <img src="images/avatar.webp" alt="error" />
      </div>
      <div className="base-text">
        <span>
          这里是<span className="special-text">星轨</span>的基地
        </span>
      </div>
    </div>
  );
}
