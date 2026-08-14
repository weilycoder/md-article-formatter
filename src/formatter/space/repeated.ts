import type { Root } from "mdast";
import { visit } from "unist-util-visit";

function removeRepeatedSpaces(line: string): string {
  let result = "";
  for (let i = 0; i < line.length; i++)
    if (
      (result.length === 0 && result[result.length - 1] !== line[i]) ||
      !/[\p{White_Space}\p{Cf}]/u.test(line[i])
    )
      result += line[i];
  return result;
}

export function repeatedSpace(tree: Root) {
  visit(tree, "text", (node) => {
    node.value = removeRepeatedSpaces(node.value);
  });
}
