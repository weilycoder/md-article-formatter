import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { materialLight, materialDark } from "@uiw/codemirror-theme-material";
import CodeMirror from "@uiw/react-codemirror";
import { Card, Flex, type CardProps } from "antd";
import { type CSSProperties, type ReactNode } from "react";

interface EditorPanelProps {
  title: string;
  value: string;
  isDark: boolean;
  readOnly?: boolean;
  onChange?: (value: string) => void;
  footerLeft: ReactNode;
  footerRight: ReactNode;
  extra?: CardProps["extra"];
  panelStyle: CSSProperties;
  footerStyle: CSSProperties;
}

export function EditorPanel({
  title,
  value,
  isDark,
  readOnly = false,
  onChange,
  footerLeft,
  footerRight,
  extra,
  panelStyle,
  footerStyle,
}: EditorPanelProps) {
  const colorExtensions = isDark ? materialDark : materialLight;

  return (
    <Card
      title={title}
      extra={extra}
      style={panelStyle}
      styles={{
        body: {
          flex: 1,
          minHeight: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <CodeMirror
        className={readOnly ? "md-editor md-editor-readonly" : "md-editor"}
        value={value}
        onChange={onChange}
        extensions={[
          markdown({ base: markdownLanguage, codeLanguages: languages }),
          EditorView.lineWrapping,
          colorExtensions,
        ]}
        theme={isDark ? "dark" : "light"}
        editable={!readOnly}
        basicSetup={{
          highlightActiveLine: !readOnly,
          closeBrackets: !readOnly,
          indentOnInput: !readOnly,
          autocompletion: false,
        }}
      />
      <Flex align="center" justify="space-between" style={footerStyle}>
        {footerLeft}
        {footerRight}
      </Flex>
    </Card>
  );
}
