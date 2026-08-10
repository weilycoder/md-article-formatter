import { visit } from "unist-util-visit";
import type { Root, Node, Parent } from "mdast";

export function insertBeforeIf(
  tree: Root,
  condition: (node: Node, index: number, parent: Parent) => boolean,
  value: string,
) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    if (condition(node, index, parent))
      parent.children.splice(index, 0, { type: "text", value });
  });
}

export function insertAfterIf(
  tree: Root,
  condition: (node: Node, index: number, parent: Parent) => boolean,
  value: string,
) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    if (condition(node, index, parent))
      parent.children.splice(index + 1, 0, { type: "text", value });
  });
}
