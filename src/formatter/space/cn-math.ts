import type { Root } from "mdast";

import { isCJK, getFirstChar, getLastChar } from "../utils";
import { insertBefore, insertAfter } from "./utils";

export function cnMath(tree: Root) {
  insertBefore(tree, (node, index, parent) => {
    if (!parent || index === undefined) return null;
    if (node.type !== "inlineMath") return null;

    const prevNode = parent.children[index - 1];
    const prevChar = getLastChar(prevNode);
    return prevChar !== undefined && isCJK(prevChar) ? " " : null;
  });

  insertAfter(tree, (node, index, parent) => {
    if (!parent || index === undefined) return null;
    if (node.type !== "inlineMath") return null;

    const nextNode = parent.children[index + 1];
    const nextChar = getFirstChar(nextNode);
    return nextChar !== undefined && isCJK(nextChar) ? " " : null;
  });
}
