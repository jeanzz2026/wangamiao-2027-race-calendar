# 两台电脑的源码协作

本文件说明在多台电脑之间协作开发 `wangamiao-2027-race-calendar` 时的特殊场景。**通用更新规则、分支流程和发布规范以仓库根目录 `AGENTS.md` 为准。**

## 开始修改

首次使用：

```sh
git clone https://github.com/jeanzz2026/wangamiao-2027-race-calendar.git
```

已有项目后，请参考 `AGENTS.md` 的"动手前强制同步"章节，先让本地与 `origin/main` 完全一致，再创建功能分支：

```sh
git fetch origin main && git reset --hard origin/main
git checkout -b codex/your-change
npm ci
npm run dev
```

## 常规合并流程

开发、构建、提交、创建 PR 与合并的完整流程，请直接按 `AGENTS.md` 执行。本文档不再重复具体命令，避免与主规范产生冲突。

## 另一台电脑的旧原始源码

如果另一台电脑保存的是项目恢复之前的原始源码（与当前 Git 历史无共同祖先），不要直接覆盖当前仓库。请按以下步骤处理：

1. 在当前仓库建立一个专门的导入分支，保留一份原始源码提交。
2. 对照 `docs/SOURCE_RECOVERY.md` 与 `CHANGELOG.md`，逐项将后续功能移植到当前源码。
3. 没有共同 Git 历史时，不能依靠 Git 自动识别两套完全不同结构的代码。
4. 统一源码结构后，后续双方统一使用 `AGENTS.md` 中的常规分支 + PR 流程。

## 在线数据与代码分开

发布工具只更新 `index.html`、构建后的 `assets/` 和版本清单，不会覆盖 `state.json`、`itra_data.json` 或 `uploads/`。不要把本地旧的在线数据推到 `main`。

源码合并不能解决两人同时通过网页编辑时整份 JSON 写入冲突；需要继续设计数据级合并才能保证同时编辑互不覆盖。
