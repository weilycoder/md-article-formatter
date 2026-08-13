import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import type { MapEntry } from "../formatter";

export function symbolReplace(
  tree: Root,
  replaceMap: Record<string, MapEntry>,
) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (node.type !== "math" && node.type !== "inlineMath") return;
    for (const [from, { enabled, to }] of Object.entries(replaceMap))
      if (enabled) node.value = node.value.replaceAll(from, " " + to + " ");
  });
}
