import type { MessageInstance } from "antd/es/message/interface";
import { useCallback } from "react";

interface UseEditorActionsParams {
  formattedText: string;
  onUploadText: (text: string) => void;
  message: MessageInstance;
}

export function useEditorActions({
  formattedText,
  onUploadText,
  message,
}: UseEditorActionsParams) {
  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = formattedText;
      ta.style.position = "fixed";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
    message.success("已复制到剪贴板");
  }, [formattedText, message]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([formattedText], {
      type: "text/markdown;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formattedText]);

  const handleUpload = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === "string") {
          onUploadText(ev.target.result);
        }
      };
      reader.readAsText(file, "UTF-8");
      return false;
    },
    [onUploadText],
  );

  return {
    handleCopy,
    handleDownload,
    handleUpload,
  };
}
