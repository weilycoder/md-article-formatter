import init, { Workspace, PositionEncoding } from "@astral-sh/ruff-wasm-web";
import type { MessageInstance } from "antd/lib/message/interface";
import type { Root } from "mdast";
import { visit } from "unist-util-visit";

export const ruffPromise = init();

let workspace: Workspace | null = null;

ruffPromise
  .then((_) => {
    workspace = new Workspace(
      {
        "line-length": 88,
        "indent-width": 4,
        format: {
          "indent-style": "space",
          "quote-style": "double",
        },
      },
      PositionEncoding.Utf16,
    );
    console.log("Ruff WASM initialized.");
  })
  .catch((err) => {
    console.error("Failed to initialize Ruff WASM:", err);
  });

export function ruffFormat(tree: Root, message?: MessageInstance) {
  if (workspace === null) {
    console.warn("Ruff is not ready. Returning original code.");
    // message?.error("Ruff is not ready.");
    return;
  }
  visit(tree, "code", (node) => {
    if (
      node.lang === "py" ||
      node.lang === "py3" ||
      node.lang === "pyi" ||
      node.lang === "python"
    ) {
      try {
        node.value = (workspace as Workspace).format(node.value).trim();
      } catch (e) {
        console.error("Ruff Format Error:", e);
        message?.warning(`Ruff 格式化 ${node.lang} 代码块失败`);
      }
    }
  });
}
