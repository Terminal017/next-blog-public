

### 一、在提交树上移动
1、HEAD 是一个对当前所在分支的符号引用 —— 也就是指向你正在其基础上进行工作的提交记录。<mark style="background: #7DFFFAA6;">HEAD 总是指向当前分支上最近一次提交记录</mark>。

2、分离的 HEAD ：让其指向了某个具体的提交记录而不是分支名。
```bash
git switch Comment1           //Comment1为提交记录，此时HEAD指向了Comment1而非main
```
Tip：实际操作中这里的Comment1是通过哈希值指定的，需要通过`git log`进行查看（取前几位即可），这并不方便。

3、**相对引用**
（1）语法：
```bash
^              //向上移动1个提交记录

~<num>         //向上移动多个提交记录
```
（2）示例：
```bash
git switch main^

git switch C1; git switch HEAD^
```
（3）使用：强制修改分支位置
```bash
git branch -f main HEAD~3
```
Tip：（1）上面的命令会将 main 分支强制指向 HEAD 的第 3 级 parent 提交。
（2）可以替换为其他提交记录（使用哈希值指定方法）。

4、**撤销变更**
（1）`git reset`方法：<mark style="background: #7DFFFAA6;">通过把分支记录回退几个提交记录来实现撤销改动</mark>。你可以将这想象成“改写历史”。`git reset` 向上移动分支，原来指向的提交记录就跟从来没有提交过一样。（reset后，变更依然存在，但处于未加入暂存区状态）
```bash
git reset HEAD^       //撤回到上一个版本
```

（2）`git revert`方法：将撤销更改分享给别人。
```bash
git revert HEAD       //撤销当前提交，并准备提交至远程仓库

```
Tip：这会创建一个新的记录。
图例：
![[Pasted image 20250125140158.png|200]]

（3）撤销操作汇总
```bash
git checkout -- 文件名          //撤销未提交的修改(恢复到最后一次提交的状态)

git reset 文件名                //撤销已暂存的修改(把修改从暂存区移除)

git reset --soft HEAD~         //撤销最后一次提交(回退到上一个)，并丢弃修改(彻底删除修改)

git reset --mixed HEAD~    //撤销最后一次提交，并将更改从暂存区移到工作区(默认m可以直接用 git reset)

git reset --hard HEAD~          //撤销最后一次提交，并清空工作区。

git restore 文件名              //恢复删除的文件(从最近的提交恢复文件)
```
Tip：（1）"文件名" 指的是你想要操作的文件的名称或路径，可以是任意单个文件。
（2）将`HEAD~`更改为其他`<commit-hash>`，用来回退到某个提交状态。
（3）`git reset` 的本质是**重新设置当前分支的 HEAD 指针**，因此它可以用来强制更改分支指向。例如在main分支时，`git reset --hard newbranch`就是让main强制指向newbranch分支，并丢弃当前分支的所有更改。

| 选项             | HEAD（指向的提交） | 暂存区（Index） | 工作区（Working Directory） |
| -------------- | ----------- | ---------- | ---------------------- |
| `--soft`       | **回退**      | **保留**     | **保留**                 |
| `--mixed` (默认) | **回退**      | **清空暂存区**  | **保留**                 |
| `--hard`       | **回退**      | **清空暂存区**  | **清空工作区**              |

### 二、整理提交记录
1、`git cherry-pick`：将某个提交（或多个提交）的更改从一个分支复制到当前分支。
```bash
git cherry-pick <commit-hash>   //单个提交

git cherry-pick <commit-hash1> <commit-hash2>                 //多个提交

git cherry-pick <start-commit-hash>^..<end-commit-hash>       //多个连续提交(选择之间所有的提交)

git cherry-pick --abort                                       //终止提交
```
Tip：（1）`<commit-hash>` 是提交的 SHA 值（哈希值）。
（2）进行提交后会创建一个挑选分支完全相同的复制，作为当前分支的下个版本（新的提交）。


### 三、交互式的rebase
1、交互式 rebase 指的是使用带参数 `--interactive` 的 rebase 命令, 简写为 `-i`。

2、命令后增加了这个选项, Git 会打开一个 UI 界面并列出将要被复制到目标分支的备选提交记录，它还会显示每个提交记录的哈希值和提交说明，提交说明有助于你理解这个提交进行了哪些更改。

3、在UI界面中，你可以：
- 调整提交记录的顺序（通过鼠标拖放来完成）
- 删除你不想要的提交（通过切换 `pick` 的状态来完成，关闭就意味着你不想要这个提交记录）
- 合并提交。 它允许你把多个提交记录合并成一个。

### 四、本地栈式提交
1、在调试分支中产生了多个分支，不希望将调试语句添加到main中，只要通过Git 复制解决问题的那一个提交记录即可。可以通过以下语句实现：
- `git rebase -i`
- `git cherry-pick`
图例：
![[Pasted image 20250125201430.png|400]]

### 五、提交的技巧1
1、情景一：你之前在 `newImage` 分支上进行了一次提交，然后又基于它创建了 `caption` 分支，然后又提交了一次。此时你想对某个以前的提交记录进行一些小小的调整。比如设计师想修改一下 `newImage` 中图片的分辨率，尽管那个提交记录并不是最新的了。

2、解决方法1：
- 先用 `git rebase -i` 将提交重新排序，然后把我们想要修改的提交记录挪到最前
- 然后用 `git commit --amend` 来进行一些小修改
- 接着再用 `git rebase -i` 来将他们调回原来的顺序
- 最后我们把 main 移到修改的最前端（用你自己喜欢的方法），就大功告成啦！
Tip：这种方法很简单，但是两次排序可能导致由rebase造成的冲突

2、解决方法2：使用`git cherry-pick`
Tip：cherry-pick 可以将提交树上任何地方的提交记录取过来追加到 HEAD 上（只要不是 HEAD 上游的提交就没问题）。
思路
- 使用`git cherry-pick`从源处追加`newImage`
- 修改`newImage`
- 继续追加`caption`

### 六、Git Tags
1、Git的 **tag** 可以永久地将某个特定的提交命名为里程碑，然后就可以像分支一样引用。（即创建一个永远指向某个分支的标签）
Tip：tag只能引用该分支，不会移动，且不能通过标签修改和提交。

2、语法：
（1）创建标签
```bash
git tag <tag-name>     //直接为当前提交打标签

git tag <tag-name> <commit-hash>    //为指定的提交添加标签

git tag -a <tag-name> -m "<message>"  //附注标签，存储了附加信息
```

（2）查看标签
```bash
git tag                       //列出所有标签

git tag -l "<pattern>"         //使用模式过滤标签

//示例: git tag -l "v1.*"   ,查看所有 v1.* 开头的标签

git show <tag-name>          //查看附注标签的详细信息
```

（3）推送标签到远程仓库
```bash
git push origin <tag-name>           //推送单个标签

git push origin --tags               //推送所有标签
```

（4）删除标签
```bash
git tag -d <tag-name>              //删除本地标签

git push origin --delete <tag-name>      //删除远程标签,要求先删除本地标签
```

3、描述标签：`git describe`
语法：
```bash
git describe <ref>
```
Tip： `<ref>`：指定要描述的提交（默认为 `HEAD`）。
输出结果：
```bash
<tag>_<numCommits>_g<hash>
```
Tip：（1）`tag` 表示的是离 `ref` 最近的标签， `numCommits` 是表示这个 `ref` 与 `tag` 相差有多少个提交记录， `hash` 表示的是你所给定的 `ref` 所表示的提交记录哈希值的前几位。
（2）当 `ref` 提交记录上有某个标签时，则只输出标签名称。’


### 六、选择 parent 提交记录
1、操作符 `^` 与 `~` 符一样，后面也可以跟一个数字。但是该操作符后面的数字与 `~` 后面的不同，并不是用来指定向上返回几代，而是<mark style="background: #7DFFFAA6;">指定合并提交记录的某个 parent 提交</mark>。
Git 默认选择合并提交的“第一个” parent 提交，在操作符 `^` 后跟一个数字可以改变这一默认行为。

2、图例：
![[Pasted image 20250125212438.png|200]]
说明：`git switch main^2`就会回到第二个parent。