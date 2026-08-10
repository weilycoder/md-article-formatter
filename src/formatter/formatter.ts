import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import type { Root } from "mdast";
import { cnCode } from "./space/cn-code";
import { cnMath } from "./space/cn-math";
import { cnEn } from "./space/cn-en";

export interface FormatOptions {
  cnEnSpace: boolean;
  cnMathSpace: boolean;
  cnCodeSpace: boolean;
}

export function formatMarkdown(input: string, options: FormatOptions): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(function myTransformer() {
      return (tree: Root) => {
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
