import type { Root } from "mdast";
import { insertBeforeIf, insertAfterIf } from "./utils";
import { isCJK, getFirstChar, getLastChar } from "../utils";

export function cnCode(tree: Root) {
  insertBeforeIf(
    tree,
    (node, index, parent) => {
      if (!parent || index === undefined) return false;
      if (node.type !== "inlineCode") return false;

      const prevNode = parent.children[index - 1];
      const prevChar = getLastChar(prevNode);
      return prevChar !== undefined && isCJK(prevChar);
    },
    " ",
  );

  insertAfterIf(
    tree,
    (node, index, parent) => {
      if (!parent || index === undefined) return false;
      if (node.type !== "inlineCode") return false;

      const nextNode = parent.children[index + 1];
      const nextChar = getFirstChar(nextNode);
      return nextChar !== undefined && isCJK(nextChar);
    },
    " ",
  );
}
