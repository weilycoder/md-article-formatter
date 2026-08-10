import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import { isCJK, getFirstChar, getLastChar } from "../utils";

export function cnCode(tree: Root) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    if (node.type !== "inlineCode") return;
    let insertSpaceBefore = false;
    let insertSpaceAfter = false;

    const prevNode = parent.children[index - 1];
    const prevChar = getLastChar(prevNode);
    if (prevChar && isCJK(prevChar)) insertSpaceBefore = true;

    const nextNode = parent.children[index + 1];
    const nextChar = getFirstChar(nextNode);
    if (nextChar && isCJK(nextChar)) insertSpaceAfter = true;

    if (insertSpaceAfter)
      parent.children.splice(index + 1, 0, { type: "text", value: " " });
    if (insertSpaceBefore)
      parent.children.splice(index, 0, { type: "text", value: " " });
  });
}
