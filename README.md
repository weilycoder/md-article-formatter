# md-article-formatter

浏览器端 Markdown 格式化工具。

## 功能特性

- 空格相关特性
  - 中英文之间自动添加空格
  - 中文与行内代码、行内公式之间自动添加空格
  - 中文标点前后去除多余空格，加粗/斜体前后移出多余空格
- 英文标点替换为中文全角标点（映射可自定义，每个条目可单独开关）
- 代码块支持 Clang Format（WASM 懒加载）
- 可选的格式化控制字符转义（如零宽空格）
- 双编辑器并排 + 差异对比（diff）
- Token 计数，一键复制 / 上传 / 下载
- 亮色 / 暗色主题切换
- 配置自动持久化到浏览器本地（localStorage）

## 开发

依赖 pnpm：

```bash
pnpm install
pnpm dev
```

开发约定可参考 [AGENTS.md](./AGENTS.md)。

## 常用脚本

| 命令 | 说明 |
| --- | --- |
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | `tsc -b && vite build` |
| `pnpm preview` | 本地预览构建产物 |
| `pnpm lint` / `pnpm lint:fix` | oxlint 检查 / 自动修复 |
| `pnpm format` / `pnpm format:check` | oxfmt 格式化 / 检查 |

## 配置

- 格式化选项通过界面调整，并自动持久化到 localStorage（选项键 `md-formatter-options`，主题键 `md-formatter-theme`）。
- 编辑器的初始示例内容见 `src/demo.md`。
