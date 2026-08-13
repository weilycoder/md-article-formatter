import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import { isCJK, isLatin, getLastChar, getFirstChar } from "../utils";
import { insertBefore } from "./utils";

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
  insertBefore(tree, (node, index, parent) => {
    if (!parent || index === undefined) return null;
    if (
      node.type !== "text" &&
      node.type !== "strong" &&
      node.type !== "emphasis"
    )
      return null;

    const currChar = getFirstChar(node);
    if (currChar === undefined) return null;

    const prevChar = getLastChar(parent.children[index - 1]);
    if (prevChar === undefined) return null;

    return (isCJK(prevChar) && isLatin(currChar)) ||
      (isLatin(prevChar) && isCJK(currChar))
      ? " "
      : null;
  });
}
