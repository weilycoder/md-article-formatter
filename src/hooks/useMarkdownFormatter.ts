import { useMemo, useState } from "react";

import initialText from "../demo.md?raw";
import {
  defaultFormatOptions,
  formatMarkdown,
  type FormatOptions,
} from "../formatter/formatter";

export function useMarkdownFormatter() {
  const [inputText, setInputText] = useState<string>(initialText);
  const [options, setOptions] = useState<FormatOptions>({
    ...defaultFormatOptions,
  });

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
