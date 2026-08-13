import type { Root } from "mdast";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { z } from "zod";

import { clangFormat } from "./code/clang-fmt";
import { remarkFormat } from "./code/remark-md";
import { cnPunctuation } from "./en-punctuation";
import { boldItalic } from "./space/bold-italic";
import { cnCode } from "./space/cn-code";
import { cnEn } from "./space/cn-en";
import { cnMath } from "./space/cn-math";
import { cnPunc } from "./space/cn-punc";

export const MapEntrySchema = z.object({
  enabled: z.boolean(),
  to: z.string(),
});

export type MapEntry = z.infer<typeof MapEntrySchema>;

export const FormatOptionsSchema = z.object({
  cnEnSpace: z.boolean().default(true),
  cnMathSpace: z.boolean().default(true),
  cnCodeSpace: z.boolean().default(true),
  cnPuncSpace: z.boolean().default(true),
  boldItalicSpace: z.boolean().default(true),
  enPunctuationReplace: z.boolean().default(true),
  enPunctuationReplaceMap: z.record(z.string(), MapEntrySchema).default({
    ",": { enabled: true, to: "，" },
    ".": { enabled: true, to: "。" },
    "?": { enabled: true, to: "？" },
    "!": { enabled: true, to: "！" },
    ":": { enabled: true, to: "：" },
    ";": { enabled: true, to: "；" },
    "(": { enabled: true, to: "（" },
    ")": { enabled: true, to: "）" },
  }),
  clangFormat: z.boolean().default(false),
  remarkFormat: z.boolean().default(false),
  showFormatControl: z.boolean().default(true),
});

export type FormatOptions = z.infer<typeof FormatOptionsSchema>;

export const defaultFormatOptions: FormatOptions = FormatOptionsSchema.parse(
  {},
);

function _formatMarkdown(input: string, options: FormatOptions): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(function myTransformer() {
      return (tree: Root) => {
        if (
          options.enPunctuationReplace &&
          Object.keys(options.enPunctuationReplaceMap).length > 0
        )
          cnPunctuation(tree, options.enPunctuationReplaceMap);
        if (options.cnEnSpace) cnEn(tree);
        if (options.cnCodeSpace) cnCode(tree);
        if (options.cnMathSpace) cnMath(tree);
        if (options.cnPuncSpace) cnPunc(tree);
        if (options.boldItalicSpace) boldItalic(tree);
        if (options.clangFormat) clangFormat(tree);
        if (options.remarkFormat) remarkFormat(tree);
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
  maxIterations: number = 8,
): string {
  let lastResult = input;
  let iteration = 0;
  for (; iteration < maxIterations; iteration++) {
    const newResult = _formatMarkdown(lastResult, options);
    if (newResult === lastResult) break;
    lastResult = newResult;
  }
  if (iteration === maxIterations)
    console.warn(
      `Warning: Maximum iterations (${maxIterations}) reached during formatting. The output may not be fully formatted.`,
    );
  return lastResult;
}
