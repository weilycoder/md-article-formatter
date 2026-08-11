import type { Root } from "mdast";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";

import { cnPunctuation } from "./en-punctuation";
import { cnCode } from "./space/cn-code";
import { cnEn } from "./space/cn-en";
import { cnMath } from "./space/cn-math";

export interface FormatOptions {
  cnEnSpace: boolean;
  cnMathSpace: boolean;
  cnCodeSpace: boolean;
  enPunctuationReplaceMap: Record<string, string>;
}

export const defaultFormatOptions: FormatOptions = {
  cnEnSpace: true,
  cnMathSpace: true,
  cnCodeSpace: true,
  enPunctuationReplaceMap: {
    ",": "，",
    ".": "。",
    "?": "？",
    "!": "！",
    ":": "：",
    ";": "；",
    "(": "（",
    ")": "）",
  },
};

export function formatMarkdown(input: string, options: FormatOptions): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(function myTransformer() {
      return (tree: Root) => {
        if (Object.keys(options.enPunctuationReplaceMap).length > 0)
          cnPunctuation(tree, options.enPunctuationReplaceMap);
        if (options.cnEnSpace) cnEn(tree);
        if (options.cnCodeSpace) cnCode(tree);
        if (options.cnMathSpace) cnMath(tree);
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
