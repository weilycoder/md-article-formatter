import type { MessageInstance } from "antd/es/message/interface";
import { useCallback } from "react";

import {
  FormatOptionsSchema,
  type FormatOptions,
} from "../formatter/formatter";

export const CONFIG_FILE_NAME = "md-formatter-config.json";

interface UseConfigActionsParams {
  options: FormatOptions;
  onImport: (options: FormatOptions) => void;
  message?: MessageInstance;
}

export function useConfigActions({
  options,
  onImport,
  message,
}: UseConfigActionsParams) {
  const handleExportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(options, null, 2)], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = CONFIG_FILE_NAME;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    message?.success("配置已导出");
  }, [options, message]);

  const handleImportConfig = useCallback(
    (file: File) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result !== "string") return;
        try {
          const parsed = JSON.parse(ev.target.result) as unknown;
          const merged = FormatOptionsSchema.parse(parsed);
          onImport(merged);
          message?.success("配置已导入");
        } catch (error) {
          console.error("Failed to import config:", error);
          message?.error("配置导入失败，请检查文件内容是否为有效的配置文件");
        }
      };
      reader.readAsText(file, "UTF-8");
      return false;
    },
    [onImport, message],
  );

  return {
    handleExportConfig,
    handleImportConfig,
  };
}
