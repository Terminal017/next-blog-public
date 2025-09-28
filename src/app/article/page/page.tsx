import BlogList from '@/ui/blog_list'

export default function AritclePage() {
  return (
    <div className="flex flex-col">
      <BlogList page_number={1} />
    </div>
  )
}
