import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import {
  isCJK,
  getFirstChar,
  getLastChar,
  setFirstChar,
  setLastChar,
} from "./utils";

function replacePunctuation(
  text: string,
  replaceMap: Record<string, string>,
): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (!replaceMap.hasOwnProperty(ch)) result += ch;
    else if (result.length > 0 && isCJK(result[result.length - 1]))
      result += replaceMap[ch];
    else if (i + 1 < text.length && isCJK(text[i + 1]))
      result += replaceMap[ch];
    else result += ch;
  }
  return result;
}

export function cnPunctuation(tree: Root, replaceMap: Record<string, string>) {
  visit(tree, "text", (node) => {
    node.value = replacePunctuation(node.value, replaceMap);
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
    if (currFChar !== undefined && replaceMap.hasOwnProperty(currFChar)) {
      const prevLChar = getLastChar(parent.children[index - 1]);
      if (prevLChar !== undefined && isCJK(prevLChar))
        setFirstChar(node, replaceMap[currFChar]);
    }

    const currLChar = getLastChar(node);
    if (currLChar !== undefined && replaceMap.hasOwnProperty(currLChar)) {
      const nextFChar = getFirstChar(parent.children[index + 1]);
      if (nextFChar !== undefined && isCJK(nextFChar))
        setLastChar(node, replaceMap[currLChar]);
    }
  });
}
