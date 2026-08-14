import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import type { MapEntry } from "../formatter";

export function symbolReplace(tree: Root, replaceTable: MapEntry[]) {
  if (replaceTable.length === 0) return;
  const replaceMap = structuredClone(replaceTable);
  replaceMap.sort((a, b) => b.from.length - a.from.length);
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;
    if (node.type !== "math" && node.type !== "inlineMath") return;
    for (const { enabled, from, to } of replaceMap)
      if (enabled) node.value = node.value.replaceAll(from, " " + to + " ");
  });
}
