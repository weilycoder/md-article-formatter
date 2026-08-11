import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { EditorView } from "@codemirror/view";
import { materialLight, materialDark } from "@uiw/codemirror-theme-material";
import { Card, type CardProps } from "antd";
import { type CSSProperties } from "react";
import CodeMirrorMerge from "react-codemirror-merge";

interface MergePanelProps {
  title: string;
  originalText: string;
  modifiedText: string;
  isDark: boolean;
  onChange?: (value: string) => void;
  extra?: CardProps["extra"];
  panelStyle: CSSProperties;
}

export function MergePanel({
  title,
  originalText,
  modifiedText,
  isDark,
  extra,
  panelStyle,
}: MergePanelProps) {
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
          overflow: "auto",
        },
      }}
    >
      <CodeMirrorMerge
        className="md-editor md-editor-readonly"
        theme={colorExtensions}
      >
        <CodeMirrorMerge.Original
          value={originalText}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            EditorView.lineWrapping,
          ]}
        />
        <CodeMirrorMerge.Modified
          value={modifiedText}
          extensions={[
            markdown({ base: markdownLanguage, codeLanguages: languages }),
            EditorView.lineWrapping,
          ]}
          basicSetup={{
            highlightActiveLine: false,
            closeBrackets: false,
            indentOnInput: false,
            autocompletion: false,
          }}
        />
      </CodeMirrorMerge>
    </Card>
  );
}
