import {
  FileMarkdownOutlined,
  MoonOutlined,
  SunOutlined,
} from "@ant-design/icons";
import { Button, Flex, Space, Typography, theme as antdTheme } from "antd";

const { Title } = Typography;

interface AppHeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

export function AppHeader({ isDark, onToggleTheme }: AppHeaderProps) {
  const { token } = antdTheme.useToken();

  return (
    <Flex
      align="center"
      justify="space-between"
      style={{
        flexShrink: 0,
        height: 56,
        padding: "0 24px",
        background: token.colorBgContainer,
        borderBottom: `1px solid ${token.colorBorderSecondary}`,
      }}
    >
      <Space size={10} align="center">
        <FileMarkdownOutlined
          style={{ fontSize: 26, color: token.colorPrimary }}
        />
        <Title level={4} style={{ margin: 0, whiteSpace: "nowrap" }}>
          Markdown 格式化工具
        </Title>
      </Space>
      <Button
        icon={isDark ? <SunOutlined /> : <MoonOutlined />}
        onClick={onToggleTheme}
      >
        {isDark ? "浅色模式" : "深色模式"}
      </Button>
    </Flex>
  );
}
