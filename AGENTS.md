# AGENTS.md

md-article-formatter：浏览器端 Markdown 格式化工具（中文排版规范化：中英文空格、标点替换等）。Vite + React 19 + TypeScript + Ant Design + unified/remark。

## 常用命令

- `pnpm dev`：启动 Vite 开发服务器
- `pnpm lint` / `pnpm lint:fix`：oxlint（规则见 `.oxlintrc.json`）
- `pnpm format` / `pnpm format:check`：oxfmt 格式化（`printWidth: 80`、`sortImports`、`sortPackageJson`）
- `pnpm build`：`tsc -b && vite build`
- ⚠️ 终端 PATH 无 `pnpm`，需用完整路径调用：`& "$env:APPDATA\npm\pnpm.cmd" <cmd>`

## 架构（关键文件）

| 路径 | 职责 |
|---|---|
| `src/formatter/formatter.ts` | unified + remark 管线入口；定义 `FormatOptions`、`MapEntry { enabled; to }`、`defaultFormatOptions`（默认值基准） |
| `src/formatter/en-punctuation.ts` | 中英文标点替换规则（文本内 + 跨节点边界） |
| `src/formatter/space/` | 空格类规则：`cn-en.ts`、`cn-code.ts`、`cn-math.ts` |
| `src/formatter/utils.ts` | 字符判定（`isCJK`/`isLatin`）与节点首尾字符读写工具 |
| `src/components/ConfigPanel.tsx` | 配置面板：`configGroups` 分组 + `switch`\|`map` 统一描述模型，数据驱动渲染 |
| `src/components/MapEditor.tsx` | 通用键值映射编辑器（每条目带启用开关） |
| `src/demo.md` | 演示/示例文档（UI 初始内容） |

## 约定

- **新增格式化规则**：在 `FormatOptions` 加字段。若为替换映射 → 用 `MapEntry { enabled, to }` 结构 + 配套总开关（如 `enPunctuationReplace` 与 `enPunctuationReplaceMap`）；然后在 `ConfigPanel.tsx` 的 `configGroups` 加一条描述即可，面板渲染零改动。
- **规则执行顺序**：在 `formatter.ts` 的 transformer 中依次调用；标点替换须在空格类规则**之前**。
- **类型自动派生**：面板的 `BooleanOptionKey` / `MapOptionKey` 由 `FormatOptions` 条件类型派生，改配置结构无需手改面板类型。
- **默认值归口**：默认配置统一放 `formatter.ts` 的 `defaultFormatOptions`，不要散落在组件里。
- **lint 注意**：禁止 `hasOwnProperty` 直接调用（用 `Object.prototype.hasOwnProperty.call`）、禁止 `any`（必要时行内 `oxlint-disable-next-line`）、禁止未使用变量。
- **UI 文案为中文**；Ant Design 组件 + antd v6。
- 代码风格由 oxfmt 统一（import 排序、80 列折行），改动后建议跑 `pnpm format`。

## 未来方向

- 计划将配置持久化到 localStorage：数据结构已是纯 JSON，`defaultFormatOptions` 作为缺失字段合并基准（当前未实现，改动时保持结构可序列化）。
