import init, { format } from "@wasm-fmt/clang-format/vite";
import type { Root } from "mdast";
import { useEffect, useState } from "react";
import { visit } from "unist-util-visit";

let isActive = false;
let initPromise: Promise<void> | null = null;

async function ensureInit() {
  if (isActive) return;
  if (initPromise !== null) return initPromise;
  initPromise = init(
    "https://cdn.jsdelivr.net/npm/@wasm-fmt/clang-format@22.1.8/clang-format.wasm",
  )
    .then(() => {
      isActive = true;
    })
    .catch((err) => {
      console.error("Failed to initialize clang-format:", err);
    });
  return initPromise;
}

export function useClangFormat() {
  const [active, setActive] = useState(isActive);

  useEffect(() => {
    let cancelled = false;

    ensureInit().then(() => {
      if (!cancelled) setActive(true);
    });

    return () => {
      cancelled = true;
    };
  }, []);

  return active;
}

function codeFmt(code: string): string {
  if (!isActive) {
    console.warn("Clang Format is not active yet.");
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
    node.value = codeFmt(node.value);
  });
}
