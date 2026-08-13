import type { Root, Node, Parent } from "mdast";
import { visit } from "unist-util-visit";

export function insertBefore(
  tree: Root,
  condition: (node: Node, index: number, parent: Parent) => string | null,
) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    const value = condition(node, index, parent);
    if (value !== null)
      parent.children.splice(index, 0, { type: "text", value });
  });
}

export function insertAfter(
  tree: Root,
  condition: (node: Node, index: number, parent: Parent) => string | null,
) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    const value = condition(node, index, parent);
    if (value !== null)
      parent.children.splice(index + 1, 0, { type: "text", value });
  });
}
