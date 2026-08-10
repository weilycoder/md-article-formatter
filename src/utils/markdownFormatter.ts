import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkMath from "remark-math";
import remarkStringify from "remark-stringify";
import { visit } from "unist-util-visit";
import type { Root } from "mdast";

export interface FormatOptions {
  cnEnSpace: boolean;
}

function isCJK(ch: string): boolean {
  if (ch.length !== 1) throw new Error("Input must be a single character.");
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x4e00 && code <= 0x9fff) || // 中文
    (code >= 0x3400 && code <= 0x4dbf) || // 中文扩展
    (code >= 0x3040 && code <= 0x309f) || // 日文平假名
    (code >= 0x30a0 && code <= 0x30ff) || // 日文片假名
    (code >= 0xac00 && code <= 0xd7af) // 韩文
  );
}

function isLatin(ch: string): boolean {
  if (ch.length !== 1) throw new Error("Input must be a single character.");
  const code = ch.charCodeAt(0);
  return (
    (code >= 0x41 && code <= 0x5a) || // A-Z
    (code >= 0x61 && code <= 0x7a) || // a-z
    (code >= 0x30 && code <= 0x39) // 0-9
  );
}

function addCnEnSpace(line: string): string {
  let result = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    result += ch;

    if (i < line.length - 1) {
      const nextCh = line[i + 1];
      if ((isCJK(ch) && isLatin(nextCh)) || (isLatin(ch) && isCJK(nextCh)))
        result += " ";
    }
  }
  return result;
}

export function formatMarkdown(input: string, options: FormatOptions): string {
  const processor = unified()
    .use(remarkParse)
    .use(remarkMath)
    .use(function myTransformer() {
      return (tree: Root) => {
        if (options.cnEnSpace) {
          visit(tree, "text", (node) => {
            node.value = addCnEnSpace(node.value);
          });
        }
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
