export default function ArticleAbstract({ abstract }: { abstract: string }) {
  return (
    <div className="border-outline-v my-6 w-full rounded-md border p-4">
      <div className="flex flex-row items-center gap-1">
        <div className="flex h-5 w-5 items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="M440-183v-274L200-596v274l240 139Zm80 0 240-139v-274L520-457v274Zm-40-343 237-137-237-137-237 137 237 137ZM160-252q-19-11-29.5-29T120-321v-318q0-22 10.5-40t29.5-29l280-161q19-11 40-11t40 11l280 161q19 11 29.5 29t10.5 40v318q0 22-10.5 40T800-252L520-91q-19 11-40 11t-40-11L160-252Zm320-228Z" />
          </svg>
        </div>
        <div className="text-base font-medium tracking-widest">AI摘要</div>
      </div>
      <div className="text-on-background/70 mt-2 text-sm">{abstract}</div>
    </div>
  )
}
