import init, { format } from "@wasm-fmt/clang-format/vite";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

let ready = false;

export const clangFormatPromise = init();

clangFormatPromise
  .then(() => {
    ready = true;
    console.log("Clang Format WASM initialized.");
  })
  .catch((err) => {
    console.error("Failed to initialize Clang Format WASM:", err);
  });

function clangFormatCode(code: string): string {
  if (!ready) {
    console.warn("Clang Format is not ready. Returning original code.");
    return code;
  }
  try {
    return format(code);
  } catch (e) {
    console.error("Clang Format Error:", e);
    return code;
  }
}

export function clangFormat(tree: Root) {
  visit(tree, "code", (node) => {
    node.value = clangFormatCode(node.value);
  });
}
