import { processLatexViaUnified } from "@unified-latex/unified-latex";
import type { MessageInstance } from "antd/lib/message/interface";
import type { Root } from "mdast";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";
import { z } from "zod";

import { clangFormat } from "./code/clang-fmt";
import { remarkFormat } from "./code/remark-md";
import { ruffFormat } from "./code/ruff-py";
import { cnPunctuation } from "./en-punctuation";
import { funcReplace } from "./math-raw/func";
import { symbolReplace } from "./math-raw/symbol";
import { boldItalic } from "./space/bold-italic";
import { cnCode } from "./space/cn-code";
import { cnEn } from "./space/cn-en";
import { cnMath } from "./space/cn-math";
import { cnPunc } from "./space/cn-punc";
import { repeatedSpace } from "./space/repeated";

export const MapEntrySchema = z.object({
  enabled: z.boolean(),
  from: z.string(),
  to: z.string(),
});

export type MapEntry = z.infer<typeof MapEntrySchema>;

const enPunctuationReplaceEntrySchema = z.object({
  enabled: z.boolean().default(true),
  from: z.string().length(1),
  to: z.string().length(1),
}) satisfies z.ZodType<MapEntry>;

const mathSymbolReplaceEntrySchema = z.object({
  enabled: z.boolean().default(true),
  from: z.string().refine((s) => s.length > 0 && !/[a-zA-Z0-9]+/.test(s)),
  to: z
    .string()
    .refine((s) => /^\\[a-zA-Z]+$/.test(s) || /^[^a-zA-Z0-9]$/.test(s)),
}) satisfies z.ZodType<MapEntry>;

const mathFuncReplaceEntrySchema = z.object({
  enabled: z.boolean().default(true),
  from: z.string().refine((s) => /^[a-zA-Z]+$/.test(s)),
  to: z.string().refine((s) => /^\\[a-zA-Z\\{\\}]+$/.test(s)),
}) satisfies z.ZodType<MapEntry>;

export const FormatOptionsSchema = z.object({
  cnEnSpace: z.boolean().default(true),
  cnMathSpace: z.boolean().default(true),
  cnCodeSpace: z.boolean().default(true),
  cnPuncSpace: z.boolean().default(true),
  boldItalicSpace: z.boolean().default(true),
  repeatedSpace: z.boolean().default(true),
  enPunctuationReplace: z.boolean().default(true),
  enPunctuationReplaceMap: z.array(enPunctuationReplaceEntrySchema).default([
    { enabled: true, from: ",", to: "，" },
    { enabled: true, from: ".", to: "。" },
    { enabled: true, from: "?", to: "？" },
    { enabled: true, from: "!", to: "！" },
    { enabled: true, from: ":", to: "：" },
    { enabled: true, from: ";", to: "；" },
    { enabled: true, from: "(", to: "（" },
    { enabled: true, from: ")", to: "）" },
  ]),
  mathSymbolReplace: z.boolean().default(true),
  mathSymbolReplaceMap: z.array(mathSymbolReplaceEntrySchema).default([
    { enabled: true, from: "*", to: "\\times" },
    { enabled: true, from: "<=", to: "\\leq" },
    { enabled: true, from: ">=", to: "\\geq" },
    { enabled: true, from: "!=", to: "\\neq" },
    { enabled: true, from: "==", to: "=" },
    { enabled: true, from: "->", to: "\\to" },
    { enabled: true, from: "<-", to: "\\gets" },
    { enabled: true, from: "=>", to: "\\implies" },
    { enabled: true, from: "<=>", to: "\\iff" },
  ]),
  mathFuncReplace: z.boolean().default(true),
  mathFuncReplaceMap: z.array(mathFuncReplaceEntrySchema).default([
    { enabled: true, from: "min", to: "\\min" },
    { enabled: true, from: "max", to: "\\max" },
    { enabled: true, from: "mex", to: "\\operatorname{mex}" },
    { enabled: true, from: "gcd", to: "\\gcd" },
    { enabled: true, from: "lcm", to: "\\operatorname{lcm}" },
    { enabled: true, from: "log", to: "\\log" },
  ]),
  clangFormat: z.boolean().default(false),
  remarkFormat: z.boolean().default(false),
  ruffFormat: z.boolean().default(false),
  showFormatControl: z.boolean().default(true),
});

export type FormatOptions = z.infer<typeof FormatOptionsSchema>;

export const defaultFormatOptions: FormatOptions = FormatOptionsSchema.parse(
  {},
);

function _formatMarkdown(
  input: string,
  options: FormatOptions,
  message?: MessageInstance,
): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkGfm, { singleTilde: false })
    .use(remarkMath)
    .use(function myTransformer() {
      return (tree: Root) => {
        if (options.enPunctuationReplace)
          cnPunctuation(tree, options.enPunctuationReplaceMap);
        if (options.mathSymbolReplace)
          symbolReplace(tree, options.mathSymbolReplaceMap);
        if (options.mathFuncReplace)
          funcReplace(tree, options.mathFuncReplaceMap);
        if (options.cnEnSpace) cnEn(tree);
        if (options.cnCodeSpace) cnCode(tree);
        if (options.cnMathSpace) cnMath(tree);
        if (options.cnPuncSpace) cnPunc(tree);
        if (options.boldItalicSpace) boldItalic(tree);
        if (options.repeatedSpace) repeatedSpace(tree);
        if (options.clangFormat) clangFormat(tree, message);
        if (options.remarkFormat) remarkFormat(tree);
        if (options.ruffFormat) ruffFormat(tree, message);
        visit(tree, (node) => {
          if (node.type === "inlineMath" || node.type === "math") {
            const ast = processLatexViaUnified().processSync(node.value);
            node.value = ast.toString();
          }
        });
      };
    })
    .use(remarkStringify, {
      bullet: "-",
      fences: true,
      listItemIndent: "one",
    });

  const result = String(processor.processSync(input));
  return options.showFormatControl
    ? result.replaceAll(
        /\p{Cf}/gu,
        (c) => `&#x${c.codePointAt(0)?.toString(16).toUpperCase()};`,
      )
    : result;
}

export function formatMarkdown(
  input: string,
  options: FormatOptions,
  message?: MessageInstance,
  maxIterations: number = 8,
): string {
  if (maxIterations <= 0) {
    console.warn(
      `Warning: maxIterations should be greater than 0. Received: ${maxIterations}. Using 1 instead.`,
    );
    maxIterations = 1;
  }
  let lastResult = _formatMarkdown(input, options, message);
  let iteration = 1;
  for (; iteration < maxIterations; iteration++) {
    const newResult = _formatMarkdown(lastResult, options);
    if (newResult === lastResult) break;
    lastResult = newResult;
  }
  if (iteration === maxIterations) {
    console.warn(
      `Warning: Maximum iterations (${maxIterations}) reached during formatting. The output may not be fully formatted.`,
    );
    message?.warning(
      `达到最大迭代次数 (${maxIterations})，格式化可能未完全完成`,
    );
  }
  return lastResult;
}
