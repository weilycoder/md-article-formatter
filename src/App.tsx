import {
  CopyOutlined,
  DownloadOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import {
  App as AntApp,
  Button,
  ConfigProvider,
  Flex,
  Grid,
  Space,
  Tag,
  Upload,
  theme as antdTheme,
} from "antd";
import zhCN from "antd/locale/zh_CN";
import { type CSSProperties } from "react";

import { AppHeader } from "./components/AppHeader";
import { ConfigPanel } from "./components/ConfigPanel";
import { EditorPanel } from "./components/EditorPanel";
import { TokenCounter } from "./components/TokenCounter";
import { useEditorActions } from "./hooks/useEditorActions";
import { useMarkdownFormatter } from "./hooks/useMarkdownFormatter";
import { useThemeMode } from "./hooks/useThemeMode";

interface AppInnerProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function AppInner({ isDark, onToggleTheme }: AppInnerProps) {
  const { message } = AntApp.useApp();
  const { token } = antdTheme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.lg === false;

  const { inputText, setInputText, options, setOptions, formattedText } =
    useMarkdownFormatter();
  const { handleCopy, handleDownload, handleUpload } = useEditorActions({
    formattedText,
    onUploadText: setInputText,
    message,
  });

  const panelStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
  };

  const footerStyle: CSSProperties = {
    padding: "8px 16px",
    borderTop: `1px solid ${token.colorBorderSecondary}`,
  };

  return (
    <Flex vertical style={{ height: "100vh", background: token.colorBgLayout }}>
      <AppHeader isDark={isDark} onToggleTheme={onToggleTheme} />

      {/* 编辑器区域：宽屏左右两栏，窄屏上下堆叠 */}
      <Flex
        gap={16}
        vertical={isMobile}
        style={{ flex: 1, minHeight: 0, padding: 16, overflow: "hidden" }}
      >
        <EditorPanel
          title="原始输入"
          value={inputText}
          onChange={setInputText}
          isDark={isDark}
          panelStyle={panelStyle}
          footerStyle={footerStyle}
          footerLeft={<TokenCounter text={inputText} />}
          footerRight={
            <Upload
              accept=".md,.txt,.markdown,text/markdown,text/plain"
              showUploadList={false}
              beforeUpload={handleUpload}
            >
              <Button icon={<UploadOutlined />}>上传</Button>
            </Upload>
          }
        />

        <EditorPanel
          title="格式化后输出"
          extra={<Tag>只读</Tag>}
          value={formattedText}
          isDark={isDark}
          readOnly
          panelStyle={panelStyle}
          footerStyle={footerStyle}
          footerLeft={<TokenCounter text={formattedText} />}
          footerRight={
            <Space>
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                onClick={handleDownload}
              >
                下载 .md
              </Button>
            </Space>
          }
        />
      </Flex>

      {/* 底部配置面板 */}
      <ConfigPanel options={options} onChange={setOptions} />
    </Flex>
  );
}

export default function App() {
  const { isDark, toggleTheme } = useThemeMode();

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        algorithm: isDark
          ? antdTheme.darkAlgorithm
          : antdTheme.defaultAlgorithm,
      }}
    >
      <AntApp>
        <AppInner isDark={isDark} onToggleTheme={toggleTheme} />
      </AntApp>
    </ConfigProvider>
  );
}
