# 王阿喵 · 2027 参赛训练计划

一个纯静态网页应用，用于管理王阿喵的 2027 年比赛训练计划与训练库，部署在 GitHub Pages。

🌐 在线地址：https://jeanzz2026.github.io/wangamiao-2027-race-calendar/

## 功能

- 赛事日历与训练计划排布
- 训练库管理（内置基础训练动作）
- 两种配色：狗狗黑 / 喵喵粉
- 撤销上一步 / 恢复初始训练库
- 跨设备同步：连接 GitHub 后，改动自动同步到仓库

## 使用

1. 打开上面的在线地址。
2. 点「log in / 连接 GitHub 后编辑」。
3. 粘贴你自己的 GitHub Fine-grained PAT（仅限本仓库 `Contents: Read and write` 权限），连接并登录。
4. 登录后任何编辑都会自动同步到仓库，多设备共享。

> token 只保存在你本机浏览器（localStorage），不进源码、不写云端、不暴露给访客。

## 安全模型

- 站点为公开 Pages，数据任何人可见（仅查看）。
- 编辑需「连接 GitHub」：用你自己的 PAT 登录，源码中**不含任何共享写凭据**。
- 加载时公开拉取 `state.json`，无需 token；保存时经你本机 token 写回仓库。

## 部署（站主）

本仓库仅存放构建产物（`dist/`）。部署通过 `deploy_rest.py` 走 GitHub Contents API：

1. 将 GitHub token 放入 `.deploy_token`（参考 `.deploy_token.example`，已被 gitignore，绝不入库）。
2. 本地构建：`node node_modules/vite/bin/vite.js build`。
3. 部署：`python deploy_rest.py`。

## 版本

当前版本 **v1.0.0**，详见 [Releases](https://github.com/jeanzz2026/wangamiao-2027-race-calendar/releases)。

## 仓库目录说明

- `index.html` / `assets/`：构建产物（由 `dist/` 部署而来）
- `state.json`：当前训练计划数据（运行时经 PAT 读写）
- 源码在本仓库之外维护，通过上面的部署脚本发布
