import { visit } from "unist-util-visit";
import type { Root, Literal } from "mdast";
import { isCJK, isLatin, getLastChar } from "../utils";
import { insertBeforeIf } from "./utils";

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
  insertBeforeIf(
    tree,
    (node, index, parent) => {
      if (!parent || index === undefined) return false;
      const currValue = (node as Literal)?.value;
      if (typeof currValue !== "string") return false;
      if (currValue.length === 0) return false;
      const currChar = currValue[0];
      const prevNode = parent.children[index - 1];
      const prevChar = getLastChar(prevNode);
      if (prevChar === undefined) return false;
      return (
        (isCJK(prevChar) && isLatin(currChar)) ||
        (isLatin(prevChar) && isCJK(currChar))
      );
    },
    " ",
  );
}
