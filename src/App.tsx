import { useCallback, useEffect, useMemo, useState, type CSSProperties } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { markdown } from '@codemirror/lang-markdown';
import { oneDark } from '@codemirror/theme-one-dark';
import {
  App as AntApp,
  Button,
  Card,
  ConfigProvider,
  Divider,
  Flex,
  Grid,
  Space,
  Tag,
  Typography,
  Upload,
  theme as antdTheme,
} from 'antd';
import {
  CopyOutlined,
  DownloadOutlined,
  FileMarkdownOutlined,
  MoonOutlined,
  SunOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import zhCN from 'antd/locale/zh_CN';
import { formatMarkdown, type FormatOptions } from './formatter/formatter';
import { ConfigPanel } from './components/ConfigPanel';
import initialText from './demo.md?raw';

const { Text, Title } = Typography;

const defaultFormatOptions: FormatOptions = {
  cnEnSpace: true,
  cnMathSpace: true,
  cnCodeSpace: true
};

function getInitialTheme(): 'light' | 'dark' {
  const saved = localStorage.getItem('md-formatter-theme');
  if (saved === 'dark' || saved === 'light') return saved;
  return window.matchMedia?.('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function countWords(text: string): number {
  const cjkChars = (text.match(/[\u4e00-\u9fff\u3400-\u4dbf]/g) || []).length;
  const englishWords = text
    .replace(/[\u4e00-\u9fff\u3400-\u4dbf]/g, ' ')
    .split(/\s+/)
    .filter((w) => /[a-zA-Z0-9]/.test(w)).length;
  return cjkChars + englishWords;
}

interface AppInnerProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function TokenCounter({ text }: { text: string }) {
  return (<Space separator={<Divider orientation="vertical" />} size={4}>
    <Text type="secondary">
      行数 <Text strong>{text.split(/\n/).length}</Text>
    </Text>
    <Text type="secondary">
      字数 <Text strong>{countWords(text)}</Text>
    </Text>
    <Text type="secondary">
      字符 <Text strong>{text.length}</Text>
    </Text>
  </Space>)
}

function AppInner({ isDark, onToggleTheme }: AppInnerProps) {
  const { message } = AntApp.useApp();
  const { token } = antdTheme.useToken();
  const screens = Grid.useBreakpoint();
  const isMobile = screens.lg === false;

  const [inputText, setInputText] = useState<string>(initialText);
  const [options, setOptions] = useState<FormatOptions>({ ...defaultFormatOptions });

  const formattedText = useMemo(() => formatMarkdown(inputText, options), [inputText, options]);

  const darkExtensions = isDark ? [oneDark] : [];

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(formattedText);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = formattedText;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    message.success('已复制到剪贴板');
  }, [formattedText, message]);

  const handleDownload = useCallback(() => {
    const blob = new Blob([formattedText], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.md';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [formattedText]);

  const panelStyle: CSSProperties = {
    flex: 1,
    minWidth: 0,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  };

  const footerStyle: CSSProperties = {
    padding: '8px 16px',
    borderTop: `1px solid ${token.colorBorderSecondary}`,
  };

  return (
    <Flex vertical style={{ height: '100vh', background: token.colorBgLayout }}>
      {/* 顶部标题栏 */}
      <Flex
        align="center"
        justify="space-between"
        style={{
          flexShrink: 0,
          height: 56,
          padding: '0 24px',
          background: token.colorBgContainer,
          borderBottom: `1px solid ${token.colorBorderSecondary}`,
        }}
      >
        <Space size={10} align="center">
          <FileMarkdownOutlined style={{ fontSize: 26, color: token.colorPrimary }} />
          <Title level={4} style={{ margin: 0, whiteSpace: 'nowrap' }}>
            Markdown 格式化工具
          </Title>
        </Space>
        <Button icon={isDark ? <SunOutlined /> : <MoonOutlined />} onClick={onToggleTheme}>
          {isDark ? '浅色模式' : '深色模式'}
        </Button>
      </Flex>

      {/* 编辑器区域：宽屏左右两栏，窄屏上下堆叠 */}
      <Flex
        gap={16}
        vertical={isMobile}
        style={{ flex: 1, minHeight: 0, padding: 16, overflow: 'hidden' }}
      >
        {/* 左栏：原始输入 */}
        <Card
          title="原始输入"
          style={panelStyle}
          styles={{
            body: {
              flex: 1,
              minHeight: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <CodeMirror
            className="md-editor"
            value={inputText}
            onChange={setInputText}
            extensions={[markdown(), ...darkExtensions]}
            theme={isDark ? 'dark' : 'light'}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: true,
              bracketMatching: true,
              closeBrackets: true,
              indentOnInput: true,
              autocompletion: false,
            }}
          />
          <Flex align="center" justify="space-between" style={footerStyle}>
            <TokenCounter text={inputText} />
            <Upload
              accept=".md,.txt,.markdown,text/markdown,text/plain"
              showUploadList={false}
              beforeUpload={(file) => {
                const reader = new FileReader();
                reader.onload = (ev) => {
                  if (typeof ev.target?.result === 'string') {
                    setInputText(ev.target.result);
                  }
                };
                reader.readAsText(file, 'UTF-8');
                return false;
              }}
            >
              <Button icon={<UploadOutlined />}>上传</Button>
            </Upload>
          </Flex>
        </Card>

        {/* 右栏：格式化输出 */}
        <Card
          title="格式化后输出"
          extra={<Tag>只读</Tag>}
          style={panelStyle}
          styles={{
            body: {
              flex: 1,
              minHeight: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
            },
          }}
        >
          <CodeMirror
            className="md-editor md-editor-readonly"
            value={formattedText}
            extensions={[markdown(), ...darkExtensions]}
            theme={isDark ? 'dark' : 'light'}
            editable={false}
            basicSetup={{
              lineNumbers: true,
              foldGutter: true,
              highlightActiveLine: false,
              bracketMatching: true,
              closeBrackets: false,
              indentOnInput: false,
              autocompletion: false,
            }}
          />
          <Flex align="center" justify="space-between" style={footerStyle}>
            <TokenCounter text={formattedText} />
            <Space>
              <Button icon={<CopyOutlined />} onClick={handleCopy}>
                复制
              </Button>
              <Button type="primary" icon={<DownloadOutlined />} onClick={handleDownload}>
                下载 .md
              </Button>
            </Space>
          </Flex>
        </Card>
      </Flex>

      {/* 底部配置面板 */}
      <ConfigPanel options={options} onChange={setOptions} />
    </Flex>
  );
}

export default function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>(getInitialTheme);
  const isDark = theme === 'dark';

  useEffect(() => {
    localStorage.setItem('md-formatter-theme', theme);
  }, [theme]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{ algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm }}
    >
      <AntApp>
        <AppInner isDark={isDark} onToggleTheme={() => setTheme(isDark ? 'light' : 'dark')} />
      </AntApp>
    </ConfigProvider>
  );
}
