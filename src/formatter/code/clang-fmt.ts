import init, { format } from "@wasm-fmt/clang-format/vite";
import type { MessageInstance } from "antd/lib/message/interface";
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

export function clangFormat(tree: Root, message?: MessageInstance) {
  if (!ready) {
    console.warn("Clang Format is not ready. Returning original code.");
    message?.error("Clang Format is not ready.");
    return;
  }
  visit(tree, "code", (node) => {
    if (!node.lang) return;
    const filename = (langToFilename as Record<string, string>)[
      node.lang.toLowerCase()
    ];
    if (!filename) return;
    try {
      node.value = format(node.value, filename);
    } catch (e) {
      console.error("Clang Format Error:", e);
      message?.warning(`Clang Format 格式化 ${node.lang} 代码块失败`);
    }
  });
}
