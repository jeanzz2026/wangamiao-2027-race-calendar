# 协作者与 AI 更新规则

本仓库是多人/多 Agent 协作项目。所有协作者（人类与 AI）共用同一套流程，规则以本文档为唯一权威来源。

## 0. 核心铁律

1. **任何改动前，本地必须先与 `origin/main` 完全一致。**
2. **所有改动必须走功能分支 + Pull Request，禁止直接 `git push origin main`。**
3. **不提交 token、密钥、环境变量、用户浏览器数据。**
4. **不覆盖 `state.json`、`itra_data.json`、`uploads/` 等在线数据。**

## 1. 动手前强制同步

```sh
# 1. 检查本地状态
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  git status --short

# 2. 拉取最新 main 并强制对齐本地
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  git fetch origin main && git reset --hard origin/main
```

- 若 `git status --short` 显示有未提交改动，**先确认归属**。自己的改动先提交或暂存；不属于自己的改动严禁 reset、覆盖或删除。
- 沙箱环境需带前缀清空代理变量；普通本机可直接执行 `git fetch origin main && git reset --hard origin/main`。
- 若 git 网络异常，`git fetch` 无法连通时，才允许临时回退到 `gh api` tarball / Contents API 方式同步本地 working tree，git 恢复后必须回归本流程。

## 2. 创建功能分支

```sh
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  git checkout -b codex/<简述>
```

- 分支名使用 `codex/<简述>` 前缀，例如 `codex/fix-image-url`、`codex/update-calendar-ui`。
- 禁止基于过期本地 main 或旧发布资源直接修改网页。

## 3. 修改与验证

- 页面主体在 `src/App.jsx`，赛事编辑在 `src/race-editor.js`，分析页在 `src/analysis-embed.js`，样式在 `src/styles/`。
- 主体源码由历史发布资源恢复，旧压缩变量名称不代表设计意图。详见 `docs/SOURCE_RECOVERY.md`。
- 修改源码，不手工编辑根目录 `assets/index-*.js`、`assets/index-*.css` 或生成后的 `index.html`。
- 使用 `npm ci` 安装锁定依赖；修改后执行 `npm run build`，行为变化验证相应页面交互。
- 发布前更新 `package.json`、`release.json`、`CHANGELOG.md` 的版本和说明，再运行 `npm run release`、`npm run check:release`。
- 源码、版本说明、锁文件和发布资源须在同一次提交中提交。
- `state.json` 与 `itra_data.json` 是在线数据。代码发布不可用旧 public 快照覆盖它们；release 工具只发布 index、构建 assets 和版本清单。
- 新图片独立存于 `uploads/takeaway/`，这是用户数据，代码发布不得清理或覆盖。
- 运行 `npm test` 验证同步和图片链路；图片实现见 `docs/IMAGE_UPLOADS.md`。

## 4. 提交并推送到分支

```sh
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  git add .
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  git commit -m "<type>: <简要描述>"
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  git push -u origin codex/<简述>
```

提交信息建议前缀：`feat:`、`fix:`、`docs:`、`refactor:`、`build:`。

## 5. 创建 Pull Request

```sh
HTTP_PROXY= HTTPS_PROXY= http_proxy= https_proxy= ALL_PROXY= all_proxy= NO_PROXY='*' \
  gh pr create --title "<type>: <标题>" --body "<改动说明>" --base main
```

- PR 标题应清楚说明改动，例如 `fix: 使用 Pages 同源地址修复图片外链 404`。
- PR body 中说明：改动了什么、为什么、如何验证、是否影响在线数据。
- CI 必须通过后再请求合并。
- **只有用户明确授权的 hotfix 才允许跳过 PR 直接推 main。**

## 6. 合并与发布

1. 提交前再次 `git fetch origin`，将最新 `origin/main` 合并到功能分支。
2. 冲突发生时合并双方源码；构建产物冲突通过重新运行 `npm run release` 解决，不手工挑压缩文件。
3. 用户审阅通过后，使用 `gh pr merge --squash`（或 GitHub 网页 squash merge）合并到 main。
4. 合并后检查 GitHub Pages 构建和网页右下角版本。
5. 本地切回 main 并再次同步：`git checkout main && git pull origin main`。

## 7. 回退与异常

- **回退优先使用 `git revert`**，产生新的 revert commit，保留历史。
- **必须 force-push 时须用户显式确认**，并提前通知其他协作者。
- git 网络异常时，可临时用 `gh api` Contents API（PUT/DELETE，GET 取 SHA 用 `?ref=<branch>`）部署或回退，但恢复后必须回归分支 + PR 流程。

## 8. 在线数据注意事项

这套流程管理代码协作。现有整份 JSON 在线数据同步仍不具备多人同时写入的事务保护；不要把源码 PR 合并视作数据同步保障。
