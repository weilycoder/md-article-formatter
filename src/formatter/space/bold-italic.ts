import type { Root } from "mdast";

import { getString, setString } from "../utils";
import { insertAfter, insertBefore } from "./utils";

export function boldItalic(tree: Root) {
  insertBefore(tree, (node, index, parent) => {
    if (!parent || index === undefined) return null;
    if (node.type !== "strong" && node.type !== "emphasis") return null;

    const curr = getString(node);
    if (curr === undefined || curr.length === 0) return null;

    const beginSpaceCount =
      curr?.match(/^[\p{White_Space}\p{Cf}]+/u)?.[0].length ?? 0;
    if (beginSpaceCount === 0) return null;
    const beginSpace = curr.slice(0, beginSpaceCount);
    setString(node, curr.slice(beginSpaceCount));
    return beginSpace;
  });
  insertAfter(tree, (node, index, parent) => {
    if (!parent || index === undefined) return null;
    if (node.type !== "strong" && node.type !== "emphasis") return null;

    const curr = getString(node);
    if (curr === undefined || curr.length === 0) return null;

    const endSpaceCount =
      curr?.match(/[\p{White_Space}\p{Cf}]+$/u)?.[0].length ?? 0;
    if (endSpaceCount === 0) return null;
    const endSpace = curr.slice(-endSpaceCount);
    setString(node, curr.slice(0, -endSpaceCount));
    return endSpace;
  });
}
