# 两台电脑的源码协作

GitHub main 是共同版本来源，不用下载整个文件夹覆盖另一台电脑。

## 开始修改

首次使用：`git clone https://github.com/jeanzz2026/wangamiao-2027-race-calendar.git`。

已有项目先 `git status`；将未提交工作提交到自己的分支，或暂存到 stash，切勿丢弃。然后：

```sh
git switch main
git pull --ff-only origin main
git switch -c codex/your-change
npm ci
npm run dev
```

核对 `release.json`、`CHANGELOG.md` 和网页右下角版本。改动源码而不是根目录压缩包。

## 保留双方改动

```sh
git add src
git commit -m "Describe your change"
git fetch origin
git merge origin/main
```

不同文件或不同位置通常自动合并。同一位置的冲突必须逐段决定保留内容，不能选择整份“我的”或“对方的”覆盖。若冲突出现在构建资源，先合并源码再重新构建。

更新 package.json 与 release.json 的版本、CHANGELOG.md 的说明，再：

```sh
npm run release
npm run check:release
git add src public scripts docs package.json package-lock.json release.json CHANGELOG.md index.html assets build-manifest.json
git commit -m "Build and document release"
git push -u origin codex/your-change
```

GitHub 创建 PR，检查通过后合并到 main，等待 Pages 部署并检查网页版本。另一人下次从更新后的 main 开始。

## 另一台电脑的旧原始源码

先建立专门的导入分支，保留一份原始源码提交；对照恢复基线与更新日志，逐项移植后续功能。没有共同 Git 历史时不能依靠 Git 自动识别两套完全不同结构的代码。统一源码后，双方才使用上面的常规合并流程。

## 在线数据与代码分开

发布工具只更新 index.html、构建 assets 和清单，不覆盖 state.json / itra_data.json。不要把本地旧在线数据推到 main。源码合并不能解决两人同时编辑网页时整份 JSON 写入冲突；需要继续设计数据级合并才能保证同时编辑互不覆盖。
