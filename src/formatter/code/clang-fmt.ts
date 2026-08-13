import init, { format } from "@wasm-fmt/clang-format/vite";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

import langToFilename from "./clang-fmt-support.json";

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

function clangFormatCode(code: string, filename: string): string {
  if (!ready) {
    console.warn("Clang Format is not ready. Returning original code.");
    return code;
  }
  try {
    return format(code, filename);
  } catch (e) {
    console.error("Clang Format Error:", e);
    return code;
  }
}

export function clangFormat(tree: Root) {
  visit(tree, "code", (node) => {
    if (!node.lang) return;
    const filename = (langToFilename as Record<string, string>)[
      node.lang.toLowerCase()
    ];
    if (!filename) return;
    node.value = clangFormatCode(node.value, filename);
  });
}
