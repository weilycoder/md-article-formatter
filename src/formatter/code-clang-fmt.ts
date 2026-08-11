import init, { format } from "@wasm-fmt/clang-format/vite";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

await init();

function codeFmt(code: string): string {
  try {
    return format(code);
  } catch (e) {
    console.error("Clang Format Error:", e);
    return code;
  }
}

export function clangFormat(tree: Root) {
  visit(tree, "code", (node) => {
    node.value = codeFmt(node.value);
  });
}
