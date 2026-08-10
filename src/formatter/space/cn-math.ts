import { visit } from "unist-util-visit";
import type { Root } from "mdast";
import { isCJK } from "../utils";

export function cnMath(tree: Root) {
  visit(tree, (node, index, parent) => {
    if (!parent || index === undefined) return;

    if (node.type !== "inlineMath") return;

    const prev = parent.children[index - 1];
    if (prev?.type === "text") {
      const val = prev.value;
      if (
        val.length > 0 &&
        isCJK(val[val.length - 1]) &&
        val[val.length - 1] !== " "
      ) {
        prev.value = val + " ";
      }
    }

    const next = parent.children[index + 1];
    if (next?.type === "text") {
      const val = next.value;
      if (val.length > 0 && isCJK(val[0]) && val[0] !== " ") {
        next.value = " " + val;
      }
    }
  });
}
