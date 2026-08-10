import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import {
  isCJK,
  getFirstChar,
  getLastChar,
  pushFrontChar,
  pushBackChar,
} from "../utils";

export function cnMath(tree: Root) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    if (node.type !== "inlineMath") return;

    const prevNode = parent.children[index - 1];
    const prevChar = getLastChar(prevNode);
    if (prevChar && isCJK(prevChar)) pushBackChar(prevNode, " ");

    const nextNode = parent.children[index + 1];
    const nextChar = getFirstChar(nextNode);
    if (nextChar && isCJK(nextChar)) pushFrontChar(nextNode, " ");
  });
}
