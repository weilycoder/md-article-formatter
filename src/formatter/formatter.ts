import type { Root } from "mdast";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

import { clangFormat } from "./code-clang-fmt";
import { cnPunctuation } from "./en-punctuation";
import { cnCode } from "./space/cn-code";
import { cnEn } from "./space/cn-en";
import { cnMath } from "./space/cn-math";
import { cnPunc } from "./space/cn-punc";

export interface MapEntry {
  enabled: boolean;
  to: string;
}

export interface FormatOptions {
  cnEnSpace: boolean;
  cnMathSpace: boolean;
  cnCodeSpace: boolean;
  cnPuncSpace: boolean;
  enPunctuationReplace: boolean;
  enPunctuationReplaceMap: Record<string, MapEntry>;
  clangFormat: boolean;
}

export const defaultFormatOptions: FormatOptions = {
  cnEnSpace: true,
  cnMathSpace: true,
  cnCodeSpace: true,
  cnPuncSpace: true,
  enPunctuationReplace: true,
  enPunctuationReplaceMap: {
    ",": { enabled: true, to: "，" },
    ".": { enabled: true, to: "。" },
    "?": { enabled: true, to: "？" },
    "!": { enabled: true, to: "！" },
    ":": { enabled: true, to: "：" },
    ";": { enabled: true, to: "；" },
    "(": { enabled: true, to: "（" },
    ")": { enabled: true, to: "）" },
  },
  clangFormat: false,
};

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
        if (options.clangFormat) clangFormat(tree);
      };
    })
    .use(remarkStringify, {
      bullet: "-",
      fences: true,
      listItemIndent: "one",
    });

  const result = processor.processSync(input);
  return String(result);
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
