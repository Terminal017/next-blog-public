import "@/styles/home_page.css";
import HomePage from "./base-content";
import ApertureAni from "@/ui/animation/aperture";

export default function Home() {
  return (
    <div className="base">
      <HomePage />
      <ApertureAni />
    </div>
  );
}
