
### 一、远程仓库
1、远程仓库是你的仓库在另个一台计算机上的拷贝。

2、**远程克隆**：`git clone`。
（1）说明：这会从远程仓库复制整个项目的代码到本地。它会下载项目的所有文件、提交历史以及版本信息，并将仓库初始化为一个可供本地开发的 Git 仓库
（2）语法：
```bash
git clone <远程仓库URL>
```
（3）常见参数：
1. 远程仓库的地址（可以是 HTTPS、SSH 或本地路径）
```bash
git clone https://github.com/user/repo.git
```
2. `--branch <分支名>`：指定要克隆的分支，默认会克隆主分支（通常是 `main` 或 `master`）。
```bash
git clone --branch dev https://github.com/user/repo.git

```
3.  `--depth <数字>`：指定克隆的历史深度，只克隆最近的几次提交。
```bash
git clone --depth 1 https://github.com/user/repo.git
```
4. `<目录>`：指定克隆到本地的目录名，默认目录名与远程仓库名称相同。
```bash
git clone https://github.com/user/repo.git D:\my-project
```
Tip：完成克隆后的本地仓库包含
- 项目的所有代码文件
- `.git` 目录，包含所有版本控制信息（提交历史、分支等）。

### 二、远程分支
1、克隆仓库后，本地会默认关联远程仓库的分支。远程分支会以 `origin/<分支名>` 的形式存在，其中 `origin` 是默认的远程仓库名称。
例如：
```bash
git branch -r          //查看远程分支

//输出:  origin/main
```

2、克隆后，默认会在本地创建一个和远程默认分支（通常是 `main` 或 `master`）同名的本地分支，并自动跟踪对应的远程分支（初始位置相同）。

3、远程分支用于记录远程仓库中该分支上一次提交时的信息，不能用于操作。如果切换到远程分支（这只是引用），进行操作，会进入HEAD分离状态。

4、`main` 和 `origin/main` 存在关联关系，这种关联关系就是由分支的“remote tracking”属性决定的。`main` 被自动设定为跟踪 `origin/main` —— 这意味着为 `main` 分支指定了推送的目的地以及拉取后合并的目标。
提示信息就说明了这一点：
```bash
local branch "main" set to track remote branch "origin/main"
```

5、自定义跟踪分支：
方法1：通过远程分支切换到一个新的分支
```bash
git switch -b trackbranch origin/main
```
方法2：设置远程追踪分支的方法就是使用：`git branch -u` 命令
```bash
git branch -u origin/main trackbranch
```
Tip：（1）这均会设置`trackbranch`跟踪`origin/main`。
（2）<mark style="background: #7DFFFAA6;">定义的跟踪分支会自动与远程分支同步</mark>（包括在pull和push时）。

### 三、Git fetch
1、**从远程仓库同步数据**：`git fetch`。
说明：用于从**远程仓库**获取最新的分支和提交信息，并将它们更新到本地的**远程分支**。注意它只会更新本地的远程分支，不会修改当前本地分支的代码或工作区内容（包括位置！）。
图例：
![[Pasted image 20250126133236.png|200]]
Tip：<mark style="background: #A3FFB8A6;">实际上将本地仓库中的远程分支更新成了远程仓库相应分支最新的状态</mark>，<mark style="background: #7DFFFAA6;">所以并不会同步！</mark>。
实际操作
- 从远程仓库下载本地仓库中缺失的提交记录
- 更新远程分支指针(如 `o/main`)

2、基本用法：
```bash
git fetch             //从默认的远程仓库(通常是 origin)获取所有分支的最新更新
git fetch origin main       //从远程仓库特定分支(main)获取更新

git fetch --all            //获取并查看所有远程分支

git fetch --depth=1        //仅获取远程仓库中最近的一次提交历史

git fetch origin C2:newbranch    //指定获取,将C2获取到newbranch分支(不推荐使用)
```

4、**合并本地分支和远程分支**：
- `git cherry-pick origin/main`
- `git rebase origin/main`
- `git merge origin/main`

### 四、Git pull
1、**更新并合并分支**：`git pull`
说明：该命令将将远程仓库中的更新拉取到本地仓库，并自动将更新合并到当前分支。可以看作是 `git fetch` 和 `git merge` 的组合操作。（merge操作时本地分支merge远程分支）

图例：
![[Pasted image 20250126135347.png|250]]         ![[Pasted image 20250126135410.png|250]]

2、基本用法：
```bash
git pull                           //拉取合并默认远程仓库的当前分支

git pull --all                     //拉取所有远程更新

git pull origin main               //从指定远程仓库和分支拉取更新

git pull --no-commit               //拉取更新但不自动合并(等同与fetch)

git pull --rebase                  //合并方式从merge改为rebase

git pull --depth=1                 //拉取深度1的提交历史
```

### 五、Git push
1、**上传分支**：`git push`
说明：该命令将你的变更上传到指定的远程仓库，并在远程仓库上合并你的新提交记录。（<mark style="background: #7DFFFAA6;">或者说将你的更改和提交推送到远程仓库</mark>）<mark style="background: #A3FFB8A6;">上传后会同步远程分支</mark>。

2、常见语法：
```bash
git push                           //推送当前分支到默认远程仓库

git push origin main               //指定分支推送(推送本地的main分支)

git push origin <local-branch>:<remote-branch>    //推送本地分支到远程的不同分支

git push --all origin                       //推送所有分支

git push origin --delete branch-name        //删除远程分支

git push origin tag-name                    //推送标签

git push origin branch-name --force         //强制推送，覆盖远程分支的内容
```

3、<mark style="background: #7DFFFAA6;">如果远程仓库有更新，会导致推送失败，需要先进行同步，才能更新</mark>。同步方法可以采用：
```bash
git pull             //这是git fetch 和 merge 的简写

git pull --rebase    //这是git fetch 和 rebase 的简写
```

### 五、远程服务器拒绝(Remote Rejected)
1、进行团队工作时，为保证安全，可能管理员会将main锁定，阻止直接push。此时需要一些pull request的流程来合并修改。

2、按照流程：新建一个分支, 推送(push)这个分支并申请pull request。
要求：
1. GitHub克隆自己的仓库
2. 始终确保main分支与团队主仓库的main分支一致。
3. 提交更改到自己的仓库，然后在github上提交pull request。


### 六、关于merge和rebase的使用
1、rebase的优点：使你的提交树变得很干净, 所有的提交都在一条线上
缺点：修改了提交树的历史

2、merge会不修改历史，但是提交树可能会存在很多交叉。


### 七、sourse的特殊用法
1、`git push` 或 `git fetch` 时不指定任何 `source`：
（1）push空到远程仓库会删除该分支！
```bash
git push origin :foo
```
（2）fetch空到本地仓库会创建新分支！
```bash
git fetch origin :bar
```
