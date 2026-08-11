import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Button,
  Col,
  Collapse,
  Divider,
  Flex,
  Input,
  Row,
  Switch,
  Typography,
  theme,
} from "antd";

import type { FormatOptions } from "../formatter/formatter";

interface ConfigPanelProps {
  options: FormatOptions;
  onChange: (options: FormatOptions) => void;
}

type BooleanFormatOptionKey = {
  [K in keyof FormatOptions]: FormatOptions[K] extends boolean ? K : never;
}[keyof FormatOptions];

interface ConfigItem {
  key: BooleanFormatOptionKey;
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

interface PunctuationMapEditorProps {
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

function PunctuationMapEditor({ value, onChange }: PunctuationMapEditorProps) {
  const entries = Object.entries(value);

  const updateFrom = (oldFrom: string, newFrom: string) => {
    const next: Record<string, string> = {};
    for (const [from, to] of entries) {
      if (from === oldFrom) {
        if (newFrom.trim() !== "") next[newFrom] = to;
      } else {
        next[from] = to;
      }
    }
    onChange(next);
  };

  const updateTo = (from: string, to: string) => {
    onChange({ ...value, [from]: to });
  };

  const removeEntry = (from: string) => {
    const next = { ...value };
    delete next[from];
    onChange(next);
  };

  const addEntry = () => {
    onChange({ ...value, "": "" });
  };

  return (
    <Flex vertical gap={8}>
      <Flex align="center" justify="space-between">
        <Flex vertical style={{ minWidth: 0 }}>
          <Typography.Text strong>英文标点替换映射</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            将紧邻中文字符的英文半角标点替换为对应的中文全角标点
          </Typography.Text>
        </Flex>
        <Button size="small" icon={<PlusOutlined />} onClick={addEntry}>
          添加映射
        </Button>
      </Flex>
      {entries.map(([from, to]) => (
        <Flex key={from} align="center" gap={8}>
          <Input
            style={{ width: 80 }}
            value={from}
            placeholder="英文"
            onChange={(e) => updateFrom(from, e.target.value)}
          />
          <Typography.Text type="secondary">→</Typography.Text>
          <Input
            style={{ width: 80 }}
            value={to}
            placeholder="中文"
            onChange={(e) => updateTo(from, e.target.value)}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={() => removeEntry(from)}
            aria-label="删除该映射"
          />
        </Flex>
      ))}
      {entries.length === 0 && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          暂无映射，点击“添加映射”新增规则
        </Typography.Text>
      )}
    </Flex>
  );
}

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
            <>
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
              <Divider style={{ margin: "16px 0" }} />
              <PunctuationMapEditor
                value={options.enPunctuationReplaceMap}
                onChange={(map) =>
                  onChange({ ...options, enPunctuationReplaceMap: map })
                }
              />
            </>
          ),
        },
      ]}
    />
  );
};

export default ConfigPanel;
