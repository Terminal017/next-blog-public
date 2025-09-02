export default function NotFound() {
  return (
    <div className="fixed flex flex-row justify-center items-center gap-6 mt-20 mb-8 w-full">
      <h2 className="text-2xl text-on-background">404 - Not Found</h2>
      <div className="w-px h-10 bg-outline-v/80"></div>
      <p className="text-xl text-on-background">你来到了未知之地</p>
    </div>
  )
}
