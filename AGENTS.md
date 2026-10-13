# 协作者与 AI 更新规则

## 先核对版本

1. `git status --short`：保留他人未提交修改。不要 reset、覆盖或删除不属于自己的工作。
2. `git fetch origin`，检查 `git log -1 origin/main`、`release.json` 和 `CHANGELOG.md`。网页右下角显示 release 版本。
3. 从最新 `origin/main` 建立独立功能分支；Codex 分支使用 `codex/` 前缀。禁止直接基于过期发布资源修改网页。

## 修改与验证

- 页面主体在 `src/App.jsx`，赛事编辑在 `src/race-editor.js`，分析页在 `src/analysis-embed.js`，样式在 `src/styles/`。
- 主体源码由历史发布资源恢复，旧压缩变量名称不代表设计意图。详见 `docs/SOURCE_RECOVERY.md`。
- 修改源码，不手工编辑根目录 `assets/index-*.js`、`assets/index-*.css` 或生成后的 `index.html`。
- 使用 `npm ci` 安装锁定依赖；修改后执行 `npm run build`，行为变化验证相应页面交互。
- 发布前更新 `package.json`、`release.json`、`CHANGELOG.md` 的版本和说明，再运行 `npm run release`、`npm run check:release`。
- 源码、版本说明、锁文件和发布资源须在同一次提交中提交。
- `state.json` 与 `itra_data.json` 是在线数据。代码发布不可用旧 public 快照覆盖它们；release 工具只发布 index、构建 assets 和版本清单。
- Token、密钥、用户浏览器数据不可提交。不要将环境变量输出到日志。

## 合并与发布

1. 提交前再次 `git fetch origin`，将最新 `origin/main` 合并到功能分支。
2. 冲突发生时合并双方源码；构建产物冲突通过重新运行 `npm run release` 解决，不手工挑压缩文件。
3. 如果获取另一台电脑的原始源码，先在专门分支导入，逐项对比当前恢复源码与 CHANGELOG；保留后续赛事编辑、报名结果、UTMB、分析页功能。不要整目录覆盖。
4. 将分支推送并创建 PR，CI 必须通过后再合并。现有 GitHub Pages 从 main 根目录发布。
5. 合并后检查 Pages 构建和网页版本。再次更新使用最新 main。

这套流程管理代码协作。现有整份 JSON 在线数据同步仍不具备多人同时写入的事务保护；不要把源码 PR 合并视作数据同步保障。
