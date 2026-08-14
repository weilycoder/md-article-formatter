import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import {
  isCJKPunctuation,
  getFirstChar,
  getLastChar,
  setFirstChar,
  setLastChar,
} from "../utils";

function removeExtraSpaces(line: string): string {
  let result = "";
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (isCJKPunctuation(ch)) {
      if (result.endsWith(" ")) result = result.slice(0, -1);
      result += ch;
    } else if (
      ch !== " " ||
      result.length === 0 ||
      !isCJKPunctuation(result.at(-1)!)
    )
      result += ch;
  }
  return result;
}

export function cnPunc(tree: Root) {
  visit(tree, "text", (node) => {
    node.value = removeExtraSpaces(node.value);
  });
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (
      node.type !== "text" &&
      node.type !== "strong" &&
      node.type !== "emphasis"
    )
      return;

    const currFChar = getFirstChar(node);
    if (currFChar === " ") {
      const prevLChar = getLastChar(parent.children[index - 1]);
      if (prevLChar !== undefined && isCJKPunctuation(prevLChar))
        setFirstChar(node, "");
    }

    const currLChar = getLastChar(node);
    if (currLChar === " ") {
      const nextFChar = getFirstChar(parent.children[index + 1]);
      if (nextFChar !== undefined && isCJKPunctuation(nextFChar))
        setLastChar(node, "");
    }
  });
}
