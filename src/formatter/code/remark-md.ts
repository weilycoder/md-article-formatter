import type { Root } from "mdast";
import remarkMath from "remark-math";
import remarkParse from "remark-parse";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import { visit } from "unist-util-visit";

function remarkFormatText(code: string): string {
  return String(
    unified()
      .use(remarkParse)
      .use(remarkMath)
      .use(remarkStringify)
      .processSync(code),
  ).trim();
}

export function remarkFormat(tree: Root) {
  visit(tree, "code", (node) => {
    if (node.lang === "md" || node.lang === "markdown" || node.lang === "mdx")
      node.value = remarkFormatText(node.value);
  });
}
