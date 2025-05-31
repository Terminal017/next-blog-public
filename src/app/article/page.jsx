import BlogList from "@/ui/blog_list"
import { article_data } from "../../lib/data.js"

export default function Home() {
  return (
    <div className="flex flex-col">
      <BlogList article_data={article_data} />
    </div>
  )
}
