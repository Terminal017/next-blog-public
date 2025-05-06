# Git 操作指南

### 一、克隆 Github 仓库到本地

1、在 Github 上新建一个仓库。

2、将 Git 移至需要克隆的目录下

```bash
cd F:\Gitclone
```

Tip：（1）当前目录会显示在上方
（2）注意 Git 中复制为`ctrl+insert`，粘贴为`shift+insert`

3、根据 URL 克隆仓库

```bash
git clone https://github.com/Terminal017/Git_test.git/
```

4、一些基本操作：
（1）
（2）添加文件到 Git 的暂存区

```bash
git add experiment.txt
```

（3）提供提交信息来描述所做的更改

```bash
git commit -m "Initial commit: Add experiment.txt"
```

（4）将本地内容推送到远程仓库

```bash
git push origin main
```

Tip：这会将 add 方法创建的文件和 commit 的说明提交到 github 仓库

（5）取消所有预提交的文件和说明

```bash
git reset
```

### 二、基础操作

1、Git 希望提交记录尽可能地轻量，因此在你每次进行提交时，它并不会盲目地复制整个目录。条件允许的情况下，它会将当前版本与仓库中的上一个版本进行对比，并把所有的差异打包到一起作为一个提交记录。

2、**提交更改**：`git commit`。
（1）说明：它的主要功能是将工作目录中已暂存的更改（通过 `git add` 添加到暂存区的文件）保存到本地的 Git 仓库中，形成一个新的提交记录。
（2）常用写法：

```bash
git commit -m "提交信息"  //提交并附带简短的描述说明（提交信息）。

git commit -a -m "提交信息"  //跳过 `git add`，自动提交所有已被跟踪的文件的更改（不包括未被跟踪的新文件）

git commit --amend         //修改上一次的提交信息或补充未提交的更改

git commit -m "这是提交标题" -m "这是提交内容的详细描述"

git commit                 //在VSC中会启用交互界面形式
```

Tip：<mark style="background: #7DFFFAA6;">工作目录指 git 克隆到本地的可见的，用于修改的目录。本地仓库指在项目根目录下的隐藏文件夹.git</mark>。

3、**创建分支**：`git branch`。
（1）查看分支

```bash
git branch   //列出所有本地分支，当前分支会标有*号。

git branch -a     //显示所有分支，包括本地和远程分支。
```

（2）创建分支

```bash
git branch 分支名        //在当前分支的基础上创建一个新分支，但不会自动切换到新分支。
git switch -c 分支名    //创建并切换到新分支（推荐用法
```

（3）切换分支

```bash
git switch 分支名      //切换到指定分支。
```

（4）删除分支

```bash
git branch -d 分支名     //删除一个已被合并到主分支的分支。

git branch -D 分支名     //强制删除一个分支（即使分支未被合并）。
```

（5）重命名分支

```bash
git branch -m 新分支名    //重命名当前分支

git branch -m 旧分支名 新分支名   //重命名指定分支
```

（6）强制合并

```bash
git branch -f 分支名 哈希值         //将分支重置为哈希值所指状态
```

Tip：（1）使用分支可以简单理解为：我想基于这个提交以及它所有的 parent 提交进行新的工作。
（2）创建一个新分支可以理解为指向某个提交记录，后续的修改均会基于指向记录的文件。
（3）<mark style="background: #A3FFB8A6;">创建名称时，一般不用加引号，但如果包含空格、特殊字符或需要转义时应当加引号</mark>。分支名尽量不要包含空格。

4、**合并分支**：`git merge`
说明：（1）在 Git 中合并两个分支时会产生一个特殊的提交记录，它有两个 parent 节点。相当于：“我要把这两个 parent 节点本身及它们所有的祖先都包含进来。”
（2）<mark style="background: #7DFFFAA6;">合并分支相当于基于合并的两个结点创建一个新节点，作为当前节点的下一个版本</mark>。
图例：
![[Pasted image 20250125125712.png|200]]
（1）合并分支：

```bash
git merge 分支名    //将指定分支的修改合并到当前分支。

git merge feature/new-feature   //快进合并
```

Tip：（1）快进合并：如果当前分支完全落后于目标分支，没有分叉点时，Git 会直接将当前分支移动到目标分支的位置。<mark style="background: #7DFFFAA6;">假设将 A1 分支合并到 main 后，使用 git merge main 可以将 A1 快进到 main 的当前位置</mark>。

（2）终止合并（如果发生冲突并且不想继续的话）

```bash
git merge --abort        //取消合并
```

5、**变基分支**：`git rebase`
说明：用于重新整理提交历史的命令，它会将一个分支上的提交转移到另一个分支的最新提交之后，生成一个更清晰的提交历史。（原记录不会被删除）
图例：
![[Pasted image 20250125130837.png|200]]
命令：

```bash
git rebase 分支名    //将当前分支的提交，转移到目标分支的最新提交之后。

git rebase --abort    //终止变更

git rebase --skip     //跳过冲突提交

git rebase --continue    //解决冲突后，执行此命令继续 Rebase。
```

Tip：（1）rebase 本质上是提取源分支的提交，并逐个应用到目标分支上，也可以理解为在目标分支上"重演"。<mark style="background: #A3FFB8A6;">因此目标分支的修改不会缺失</mark>。
（2）注意这项命令会改变历史，测试时请使用安全的 Merge。

### 三、常用命令组合

1、按顺序：

```bash
git clone <远程仓库地址>

git status      //查看状态，是否有文件被删除

git add . /git add 文件名

git commit -m "提交说明"

git status      //再次确认状态

git push origin dev

git merge dev    //合并测试分支

git commit --amend  //修改commit

git push origin main
```

Tip：`git status` 用于查看 **当前仓库的状态**，显示与 Git 仓库相关的各种信息，包括工作区和暂存区的文件状态。

### 四、日常命令组合

1、**初始化操作**

```bash
git init      //初始化仓库

git config --list      //查看配置信息
```

Tip：可以采取 init 或者 clone 来初始化一个仓库。通过 clone 不需要查看配置

2、**基本操作**

```bash
git status     //查看状态

git add 文件名     //添加文件到暂存区
git add .  # 添加所有文件

git commit -m "提交说明"   //提交代码

git log               //查看代码
git log --oneline  # 简洁模式

git diff             //对比工作区和暂存区的修改
```

3、**分支管理**

```bash
git branch                   //查看分支

git branch 分支名             //创建分支

git switch 分支名            //切换分支
git switch -c 分支名         //创建并切换分支

git merge 分支名             //合并分支

git branch -d 分支名         //删除未合并的分支
```

4、**远程操作**

```bash
git clone 仓库地址         //克隆远程仓库

git remote -v             //查看远程仓库

git remote add origin 仓库地址      //添加远程仓库

git pull                  //拉取最新代码

git push origin 分支名     //推送代码到远程仓库

git push origin --delete 分支名    //删除远程分支
```

5、**撤销与恢复**

```bash
git checkout -- 文件名      //撤销未提交的修改

git reset 文件名            //撤销已暂存的修改

git reset --soft HEAD~       //撤销最后一次提交(保留修改)

git reset --hard HEAD~       //撤销最后一次修改(丢弃修改)

git restore 文件名            //恢复删除的文件
```

6、修改文件与提交（按顺序）

```bash
//在VSC中修改文件

git status            //查看文件修改状态

git add A1.html       //将修改的文件添加到暂存区
git add.              //一次性添加所有修改的文件

git commit -m "repair A1"    //提交修改

git push origin main         //推送修改
```

7、一些高级操作

```bash
git rebase -i HEAD~n       //交互式整理提交历史

git show 提交哈希值         //查看某次提交的详细内容

git clean -f               //清理未跟踪的文件
```

8、帮助

```bash
git help 命令名
```
