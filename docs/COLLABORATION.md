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

## 跨机器行尾（CRLF / LF）安全重规范化

仓库根已加 `.gitattributes`（`* text=auto eol=lf`，图片为 binary、svg 为 `eol=lf`），提交与 CI 重建都使用 LF，可杜绝跨平台 `check:release` 逐字节比对失败。但 Git 的行尾规范化有一个**跨机器陷阱**，多台电脑协作时必须按下面的安全流程处理，不能假设"pull 了 `.gitattributes` 就自动修好了"。

### 为什么另一台电脑可能残留 CRLF

- `git add --renormalize .` 只改写 **Git 索引 / 提交**，不会重写工作区磁盘上的文件。
- 一台旧工作区在 `pull` 了 `.gitattributes` 之后，那些**内容从未改动过**的文件，Git 用 clean 过滤（CRLF→LF）后与索引哈希一致，会判定为"未改"——`git status` 不报、肉眼也看不出，但磁盘上仍可能是 CRLF。
- 只有真正重写磁盘（被 checkout / `reset --hard` 触碰到的文件）才会变成 LF；未被触碰的文件会一直保留旧行尾。

因此：**`git status` 显示干净 ≠ 磁盘是 LF**。每台协作电脑都应主动审计，而不能把"某台机器跑过"当作其他机器已修好的证据。

### 安全重规范化流程（强制）

`git checkout -- <files>` / `git checkout-index -f` 会**强制用索引覆盖工作区，直接丢弃未提交改动**。绝不能让协作者不经确认就照跑。正确顺序：

1. **先确认工作区状态**：
   ```sh
   git status --short
   ```
   若有未提交改动，**先处理**：要么提交，要么 `git stash` 暂存，要么手动备份——绝不能在脏工作区上做强制 checkout。
2. **确认干净后**，再 renormalize 并强制重写磁盘：
   ```sh
   git add --renormalize .   # 把索引/提交统一成 LF
   git checkout -- .         # 用 LF 索引覆盖磁盘（仅在工作区干净时执行）
   ```
3. **审计验证磁盘确为 LF**（任一已跟踪文本文件都不应出现 CR）：
   ```sh
   git ls-files -z | while IFS= read -r -d '' f; do
     [ -f "$f" ] && grep -Iq . "$f" 2>/dev/null && grep -lq $'\r' "$f" 2>/dev/null && echo "CRLF: $f"
   done
   ```
   输出为空即表示磁盘已全 LF。

### 要点

- 本机若只是 `pull`（fast-forward）且文件未被改动，磁盘不会自动变 LF；需要上述主动重规范化。
- `git reset --hard origin/main` 会重写工作树，**执行它本身就能把磁盘刷成 LF**（前提是索引已是 LF）；但它同样会丢弃未提交改动，执行前仍需先确认工作区干净或已备份。
- 每台协作电脑各自审计、各自确认干净后再处理；不要把"在某台机器跑过"当作其他机器已修好的证据。
