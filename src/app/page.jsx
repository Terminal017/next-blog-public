import Header from "@/ui/head_nav";
import BlogList from "@/ui/blog_list";
import "@/styles/globals.css";

export default function Home() {
  return (
    <div className="flex flex-col">
      <Header />
      <BlogList />
    </div>
  );
}
