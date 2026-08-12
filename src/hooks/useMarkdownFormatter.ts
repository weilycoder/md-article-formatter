import { useEffect, useMemo, useState } from "react";

import initialText from "../demo.md?raw";
import {
  defaultFormatOptions,
  formatMarkdown,
  FormatOptionsSchema,
  type FormatOptions,
} from "../formatter/formatter";

function getInitialFormatOptions(): FormatOptions {
  const saved = localStorage.getItem("md-formatter-options");
  if (saved) {
    try {
      return FormatOptionsSchema.parse(JSON.parse(saved));
    } catch (error) {
      console.error("Failed to parse saved format options:", error);
    }
  }
  return { ...defaultFormatOptions };
}

export function useMarkdownFormatter() {
  const [inputText, setInputText] = useState<string>(initialText);
  const [options, setOptions] = useState<FormatOptions>(
    getInitialFormatOptions(),
  );

  useEffect(() => {
    localStorage.setItem("md-formatter-options", JSON.stringify(options));
  }, [options]);

  const formattedText = useMemo(
    () => formatMarkdown(inputText, options),
    [inputText, options],
  );

  return {
    inputText,
    setInputText,
    options,
    setOptions,
    formattedText,
  };
}
