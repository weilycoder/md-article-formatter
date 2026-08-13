# AGENTS.md

md-article-formatter：浏览器端 Markdown 格式化工具（中文排版规范化：中英文空格、标点替换等）。Vite + React 19 + TypeScript + Ant Design + unified/remark。

## 常用命令

- `pnpm dev`：启动 Vite 开发服务器
- `pnpm lint` / `pnpm lint:fix`：oxlint（规则见 `.oxlintrc.json`）
- `pnpm format` / `pnpm format:check`：oxfmt 格式化（`printWidth: 80`、`sortImports`、`sortPackageJson`）
- `pnpm build`：`tsc -b && vite build`
- `pnpm preview`：本地预览构建产物

## 部署

- `.github/workflows/gh-pages.yml`：`main` 分支 push 时自动构建并发布 GitHub Pages（`pnpm build --base=/${{ github.event.repository.name }}/`）。

## 架构（关键文件）

| 路径 | 职责 |
|---|---|
| `src/formatter/formatter.ts` | unified + remark 管线入口；用 zod 定义 `FormatOptionsSchema`/`MapEntrySchema` 并派生 `FormatOptions`、`MapEntry` 类型；`defaultFormatOptions` 由 `FormatOptionsSchema.parse({})` 生成 |
| `src/formatter/en-punctuation.ts` | 中英文标点替换规则（文本内 + 跨节点边界） |
| `src/formatter/code-clang-fmt.ts` | Clang Format 规则（`clangFormat` 开关）：WASM 懒加载 + `useClangFormat()` 状态 hook，遍历 `code` 节点格式化 |
| `src/formatter/space/` | 空格类规则：`cn-en.ts`、`cn-code.ts`、`cn-math.ts`、`cn-punc.ts`、`bold-italic.ts`；`utils.ts` 提供跨节点插入工具（`insertBefore`/`insertAfter`） |
| `src/formatter/utils.ts` | 字符判定（`isCJK`/`isLatin` 等）与节点首尾字符读写工具 |
| `src/components/ConfigPanel.tsx` | 配置面板：`configGroups` 分组 + `switch`\|`map` 统一描述模型，数据驱动渲染；`map` 项带 `enabledKey` 总开关与可选 `rowValidator` |
| `src/components/MapEditor.tsx` | 通用键值映射编辑器（每条目带启用开关） |
| `src/components/AppHeader.tsx`、`EditorPanel.tsx`、`MergePanel.tsx`、`TokenCounter.tsx` | 顶部栏（主题切换）、CodeMirror 编辑面板、差异对比（react-codemirror-merge）、token 计数 |
| `src/hooks/useMarkdownFormatter.ts` | 状态中枢：输入/输出文本 + `options`；localStorage 持久化（键 `md-formatter-options`）与 `formatMarkdown` 调用 |
| `src/hooks/useEditorActions.ts`、`useThemeMode.ts` | 复制/上传/下载动作；主题模式（localStorage 键 `md-formatter-theme`） |
| `src/demo.md` | 演示/示例文档（UI 初始内容） |

## 约定

- **新增格式化规则**：在 `FormatOptions` 加字段。若为替换映射 → 用 `MapEntry { enabled, to }` 结构 + 配套总开关（如 `enPunctuationReplace` 与 `enPunctuationReplaceMap`）；然后在 `ConfigPanel.tsx` 的 `configGroups` 加一条描述即可，面板渲染零改动。
- **规则执行顺序**（`formatter.ts` transformer 内）：`cnPunctuation` → `cnEn` → `cnCode` → `cnMath` → `cnPunc` → `boldItalic` → `clangFormat`；标点替换须在空格类规则之前。
- **格式化收敛**：`formatMarkdown(input, options, maxIterations = 8)` 循环执行管线直到输出稳定；新增规则须保证幂等（再次执行不再改变结果）。
- **配置 schema 为唯一真源**：新增 `FormatOptions` 字段须在 `FormatOptionsSchema` 中声明（zod `.default()` 提供缺省值），`defaultFormatOptions` 与 localStorage 校验均由此派生，勿在别处手写默认值。
- **类型自动派生**：面板的 `BooleanOptionKey` / `MapOptionKey` 由 `FormatOptions` 条件类型派生，改配置结构无需手改面板类型。
- **默认值归口**：默认配置统一放 `formatter.ts` 的 `defaultFormatOptions`，不要散落在组件里。
- **lint 注意**：禁止 `hasOwnProperty` 直接调用（用 `Object.prototype.hasOwnProperty.call`）、禁止 `any`（必要时行内 `oxlint-disable-next-line`）、禁止未使用变量。
- **UI 文案为中文**；Ant Design 组件 + antd v6。
- 代码风格由 oxfmt 统一（import 排序、80 列折行），改动后建议跑 `pnpm format`。

## 未来方向

- 配置持久化已实现（localStorage 键 `md-formatter-options` 与 `md-formatter-theme`，通过 `FormatOptionsSchema.parse` 校验合并）；如需扩展可考虑配置导入/导出。
- 当前无测试框架；若为格式化规则补充单测，可针对 `formatMarkdown` 的幂等性做回归。
