# 王阿喵 · 2027 参赛与训练计划

用于安排赛事、训练计划和 Takeaway 执行记录的 React 静态应用，部署在 GitHub Pages。

[打开网页](https://jeanzz2026.github.io/wangamiao-2027-race-calendar/) · [版本记录](CHANGELOG.md) · [当前版本信息](release.json)

## 协作规则

**所有人和 Agent 均以根目录 [AGENTS.md](AGENTS.md) 为唯一协作规范。** 本 README 介绍项目与运行方式，不另行定义一套部署流程。

- 动手前按 AGENTS.md 核对、保护本地未提交工作，再同步最新 `origin/main`；不能用旧文件夹覆盖新版。
- 同步整个仓库，不只是 `src/`：源码、锁文件、配置、脚本、文档和对应发布资源都必须匹配。
- 所有改动走功能分支与 PR，检查通过、用户审阅后按规范 squash 合并。网络异常时的 API 例外也以 AGENTS.md 为准。
- 代码发布不得覆盖在线 `state.json`、`itra_data.json`、`uploads/`，不得提交 Token、密钥或浏览器数据。
- 多电脑与旧源码导入的特殊情况见 [协作说明](docs/COLLABORATION.md)。

## 功能

- **参赛计划**：按月排布、搜索及筛选赛事；登录后添加和编辑赛事、日期、官网、UTMB 属性及报名结果。
- **训练计划**：训练类型库、周/月日历、安排训练和相关统计。
- **Takeaway**：记录实际训练、完成度、富文本 Comments 与图片，与训练计划区分保存。
- **数据分析**：嵌入 Trail Race Lab；首次唤醒 Streamlit 可能需要约 30 秒至 1 分钟，也可独立打开。
- 支持主题切换、响应式布局以及 ITRA 信息展示。

## 本地开发

使用 Node.js 22（与当前 CI 配置一致）及 npm。首次获取项目：

```sh
git clone https://github.com/jeanzz2026/wangamiao-2027-race-calendar.git
cd wangamiao-2027-race-calendar
```

已有旧工作区时，先执行 AGENTS.md 的同步与保护步骤；确认从最新 main 创建功能分支后：

```sh
npm ci
npm run dev
```

Token 不参与前端构建，不需要把编辑网页用的 Token 写进源码或 `.env`。可选开发配置见 [.env.example](.env.example)。

### 验证与生成发布资源

```sh
npm test
npm run build
```

涉及正式版本发布时，先按规范更新 `package.json`、`release.json` 和 `CHANGELOG.md`，再运行：

```sh
npm run release
npm run check:release
```

`release` 根据源码生成并更新根目录的发布页面、构建 assets 和 `build-manifest.json`；`check:release` 验证源码与发布文件一致。它们不会将本地 public 数据快照发布回在线 JSON，也不会清理用户上传图片。

版本调整及发布要求以 AGENTS.md 为准；PR 中应明确说明是否涉及源码、版本和发布资源，不夹带无关构建文件，也不能将已有失败检查描述为通过。

## 项目结构

| 路径 | 用途 |
| --- | --- |
| `src/App.jsx` | 页面主体与交互 |
| `src/lib/` | 同步、本机存储、图片处理及其他辅助模块 |
| `src/race-editor.js` | 赛事编辑功能 |
| `src/analysis-embed.js` | Streamlit 嵌入 |
| `src/styles/` | 源样式 |
| `public/` | 构建用静态资源；其中数据快照由预备脚本复制且被忽略 |
| `tests/` | 自动回归测试 |
| `scripts/prepare-data.mjs` | 为本地开发/构建准备数据副本 |
| `scripts/release.mjs` | 生成和验证发布资源 |
| `index.html`、`assets/` | GitHub Pages 使用的发布资源；不直接手改生成文件 |
| `state.json`、`itra_data.json`、`uploads/` | 在线用户数据；不是可以随意覆盖的构建缓存 |
| `release.json`、`CHANGELOG.md`、`build-manifest.json` | 版本说明与发布校验 |

主体源码由历史发布包恢复，并非原作者原始 JSX，部分变量仍保留历史命名。恢复来源、局限和旧源码移植方式见 [源码恢复说明](docs/SOURCE_RECOVERY.md)。`scripts/recover-source.cjs` 是一次性恢复工具，不是常规开发或发布入口。

## 网页登录与跨设备数据

网页无需登录即可查看公开数据；编辑时连接你自己的 GitHub Token，并确保对本仓库有 `Contents: Read and write` 权限。Token 保存在本机浏览器，不应共享给协作者或提交到仓库。

- 完整本机状态保存到 **IndexedDB**，兼容读取旧版 localStorage；Token 和部分偏好仍使用 localStorage。
- 编辑保存先保留本机状态，再尝试后台同步到仓库 `state.json`。请以页面同步结果判断是否真正上传成功。
- 干净缓存会检查云端更新；遇到未知旧缓存、未同步改动或版本冲突时，保留本机内容并提示核对，不强行覆盖另一设备。
- “从云端下载”会替换当前本机状态，未同步内容先备份；“上传到云端”可能需要确认使用本机完整版本。处理前请核对双方最新内容。
- 获取最新 Git 源码与让浏览器采用最新云端数据是两件事；另一设备尚未成功上传的内容不会出现在 GitHub 中。

现有整份 JSON 同步不是多人实时协同数据库；源码 PR 合并不能保证同时编辑的业务数据自动合并。

## 图片

新加入的图片先在浏览器压缩，再独立保存到 `uploads/takeaway/`，Comments 保存图片链接；后续修改文字不必重新上传相同图片。

当前图片链接使用 GitHub Pages 同源地址，上传校验使用 GitHub API。新图片上传后，需要等待 Pages 部署生效才可通过网页地址访问，短暂未显示时先检查部署状态，不必反复上传。历史内嵌图片继续兼容显示，不会因为代码发布自动迁移或删除。

支持格式、大小、压缩方式及草稿恢复见 [图片保存说明](docs/IMAGE_UPLOADS.md)。该说明中的实现细节应结合当前源码和 [更新日志](CHANGELOG.md) 核对。

## 发布与安全

GitHub Pages 从 **main 分支根目录**发布。完整流程请执行 AGENTS.md：功能分支 → PR → 检查通过 → 用户审阅 → squash 合并 → 检查 Pages 和网页版本 → 本地同步 main。

不要再按旧的 `deploy_rest.py` / `.deploy_token` 说明直接发布到 main，也不要运行历史恢复工作区中的临时发布脚本替代当前流程。版本以 `release.json`、CHANGELOG 和已验证的实际部署为准，不以旧 README 版本文字为准。

仓库和网站公开，JSON、图片及 Git 历史可能被他人读取。不要上传隐私照片或敏感信息；删除当前文件也不等于清除公开历史。
