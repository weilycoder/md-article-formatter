import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import { isCJK, isLatin } from "../utils";

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

export function cnEn(tree: Root) {
  visit(tree, "text", (node) => {
    node.value = addCnEnSpace(node.value);
  });
}
