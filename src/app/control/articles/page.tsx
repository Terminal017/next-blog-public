import getArticle from '@/features/admin/get_article'

export default async function ControlArticles() {
  const [article_num, article_list] = await getArticle(1)

  return (
    <main className="container-main">
      <div className="mt-12 grid w-[60rem] max-w-9/10">
        <div className="mt-12 mb-6 flex w-full flex-row items-end justify-between">
          <h1 className="text-3xl font-bold tracking-widest">文章列表</h1>
          <button
            className="border-outline/80 hover:border-primary hover:text-primary 
            rounded-lg border px-3 py-1 text-lg font-medium"
          >
            Add New
          </button>
        </div>
        <div
          className="border-outline overflow-x-auto rounded-lg border-2
        border-solid py-2"
        >
          <table className="w-full ">
            <caption className="px-4 py-1 text-left text-sm font-medium">
              共 {article_num} 篇文章
            </caption>
            <thead className="bg-surface-highest text-left">
              <tr>
                <th className="py-3 pl-8">文章标题</th>
                <th className="px-4 py-3">创建时间</th>
                <th className="px-4 py-3">修改时间</th>
                <th className="px-4 py-3">修改</th>
                <th className="px-4 py-3">删除</th>
              </tr>
            </thead>
            <tbody>
              {article_list.map((article, index) => (
                <tr
                  key={index}
                  className="hover:bg-surface-high cursor-default"
                >
                  <td className="py-4 pl-8 font-medium">{article.title}</td>
                  <td className="px-4 py-4">{article.createAt}</td>
                  <td className="px-4 py-4">{article.updateAt}</td>
                  <td className="px-4 py-4">
                    <button className="h-6 w-6">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                      </svg>
                    </button>
                  </td>
                  <td className="px-4 py-4">
                    <button className="flex h-6 w-6 items-end">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -960 960 960"
                        fill="currentColor"
                      >
                        <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  )
}
