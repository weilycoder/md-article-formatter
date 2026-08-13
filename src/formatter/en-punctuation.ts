import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import type { MapEntry } from "./formatter";
import {
  isCJK,
  getFirstChar,
  getLastChar,
  setFirstChar,
  setLastChar,
} from "./utils";

function replacePunctuation(
  text: string,
  replaceMap: Record<string, MapEntry>,
): string {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const entry = replaceMap[ch];
    if (!entry || !entry.enabled) result += ch;
    else if (result.length > 0 && isCJK(result[result.length - 1]))
      result += entry.to;
    else if (i + 1 < text.length && isCJK(text[i + 1])) result += entry.to;
    else result += ch;
  }
  return result;
}

export function cnPunctuation(
  tree: Root,
  replaceMap: Record<string, MapEntry>,
) {
  if (Object.keys(replaceMap).length === 0) return;
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
    const fEntry = currFChar !== undefined ? replaceMap[currFChar] : undefined;
    if (fEntry && fEntry.enabled) {
      const prevLChar = getLastChar(parent.children[index - 1]);
      if (prevLChar !== undefined && isCJK(prevLChar))
        setFirstChar(node, fEntry.to);
    }

    const currLChar = getLastChar(node);
    const lEntry = currLChar !== undefined ? replaceMap[currLChar] : undefined;
    if (lEntry && lEntry.enabled) {
      const nextFChar = getFirstChar(parent.children[index + 1]);
      if (nextFChar !== undefined && isCJK(nextFChar))
        setLastChar(node, lEntry.to);
    }
  });
}
