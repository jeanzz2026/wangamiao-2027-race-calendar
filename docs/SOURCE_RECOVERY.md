# 源码恢复说明

本次从 GitHub main 提交 `62b60ad244d70659efb3edf81150b2906d55b615` 的发布文件恢复源码，不将本地旧版本当作线上基线。原发布资源为 `assets/index-DCS7LwvL.js`、`assets/index-DmxdIO7I.css`，可从该提交取回比对。

恢复方式：解析发布包 AST，移除其中内嵌的 React/ReactDOM/Scheduler，将页面的 JSX runtime 调用恢复为 JSX，连接正式 npm React 与 ReactDOM；保留赛事数据、页面布局、同步逻辑及资源内容。赛事编辑和分析页的可读脚本原样导入后进行兼容性修正。

这不是原作者的原始源码：注释、原始变量名称与组件分层无法从压缩包完整恢复。目前 App 内仍有历史压缩命名。页面组件在 `src/App.jsx`，默认数据、配置与辅助函数在 `src/lib/application-support.js`；它已可读、可修改、可重新构建。后续可逐步把训练日历、Takeaway、同步和登录拆成单独组件，并在每步验证行为。

如果另一台电脑有原始源码，在新分支导入并比较，不直接覆盖当前代码。先用 Git共同历史合并；若两套源码没有共同历史，逐项移植变更并对照 CHANGELOG 验证，之后双方统一使用同一仓库 main。

`scripts/recover-source.cjs` 为一次性恢复工具，只用于审计来源；日常开发不需要运行。它依赖锁文件中的 Babel AST 工具及 GitHub CLI，运行时需要仓库读取权限。恢复快照 `.recovery/` 不提交。
