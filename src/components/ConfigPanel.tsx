import { Col, Collapse, Flex, Row, Switch, Typography, theme } from "antd";

import type { FormatOptions } from "../formatter/formatter";

interface ConfigPanelProps {
  options: FormatOptions;
  onChange: (options: FormatOptions) => void;
}

interface ConfigItem {
  key: keyof FormatOptions;
  label: string;
  description: string;
}

const configItems: ConfigItem[] = [
  {
    key: "cnEnSpace",
    label: "中英文空格",
    description: "中英文之间自动添加空格",
  },
  {
    key: "cnMathSpace",
    label: "中文与行内公式空格",
    description: "中文与行内公式之间自动添加空格",
  },
  {
    key: "cnCodeSpace",
    label: "中文与行内代码空格",
    description: "中文与行内代码之间自动添加空格",
  },
];

export const ConfigPanel = ({ options, onChange }: ConfigPanelProps) => {
  const { token } = theme.useToken();

  return (
    <Collapse
      ghost
      defaultActiveKey={["config"]}
      style={{
        flexShrink: 0,
        background: token.colorBgContainer,
        borderTop: `1px solid ${token.colorBorderSecondary}`,
      }}
      items={[
        {
          key: "config",
          label: "配置面板",
          children: (
            <Row gutter={[16, 16]}>
              {configItems.map((item) => (
                <Col key={item.key} xs={24} sm={24} md={12} lg={8} xl={6}>
                  <Flex align="center" justify="space-between" gap={12}>
                    <Flex vertical style={{ minWidth: 0 }}>
                      <Typography.Text strong>{item.label}</Typography.Text>
                      <Typography.Text
                        type="secondary"
                        style={{ fontSize: 12 }}
                      >
                        {item.description}
                      </Typography.Text>
                    </Flex>
                    <Switch
                      checked={options[item.key]}
                      onChange={(checked) =>
                        onChange({ ...options, [item.key]: checked })
                      }
                    />
                  </Flex>
                </Col>
              ))}
            </Row>
          ),
        },
      ]}
    />
  );
};

export default ConfigPanel;
