import {
  Col,
  Collapse,
  Divider,
  Flex,
  Row,
  Switch,
  Typography,
  theme,
} from "antd";

import type { FormatOptions, MapEntry } from "../formatter/formatter";
import { MapEditor } from "./MapEditor";

interface ConfigPanelProps {
  options: FormatOptions;
  onChange: (options: FormatOptions) => void;
}

type BooleanOptionKey = {
  [K in keyof FormatOptions]: FormatOptions[K] extends boolean ? K : never;
}[keyof FormatOptions];

type MapOptionKey = {
  [K in keyof FormatOptions]: FormatOptions[K] extends Record<string, MapEntry>
    ? K
    : never;
}[keyof FormatOptions];

type ConfigItem =
  | {
      kind: "switch";
      key: BooleanOptionKey;
      label: string;
      description: string;
    }
  | {
      kind: "map";
      key: MapOptionKey;
      enabledKey: BooleanOptionKey;
      label: string;
      description: string;
      fromLabel: string;
      toLabel: string;
    };

interface ConfigGroup {
  id: string;
  title: string;
  items: ConfigItem[];
}

const configGroups: ConfigGroup[] = [
  {
    id: "space",
    title: "空格",
    items: [
      {
        kind: "switch",
        key: "cnEnSpace",
        label: "中英文空格",
        description: "中英文之间自动添加空格",
      },
      {
        kind: "switch",
        key: "cnMathSpace",
        label: "中文与行内公式空格",
        description: "中文与行内公式之间自动添加空格",
      },
      {
        kind: "switch",
        key: "cnCodeSpace",
        label: "中文与行内代码空格",
        description: "中文与行内代码之间自动添加空格",
      },
    ],
  },
  {
    id: "punctuation",
    title: "标点",
    items: [
      {
        kind: "map",
        key: "enPunctuationReplaceMap",
        enabledKey: "enPunctuationReplace",
        label: "英文标点替换映射",
        description: "将紧邻中文字符的英文半角标点替换为对应的中文全角标点",
        fromLabel: "英文标点",
        toLabel: "中文标点",
      },
    ],
  },
];

interface SwitchItemProps {
  item: Extract<ConfigItem, { kind: "switch" }>;
  options: FormatOptions;
  onChange: (options: FormatOptions) => void;
}

function SwitchItem({ item, options, onChange }: SwitchItemProps) {
  return (
    <Flex align="center" justify="space-between" gap={12}>
      <Flex vertical style={{ minWidth: 0 }}>
        <Typography.Text strong>{item.label}</Typography.Text>
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          {item.description}
        </Typography.Text>
      </Flex>
      <Switch
        checked={options[item.key]}
        onChange={(checked) => onChange({ ...options, [item.key]: checked })}
      />
    </Flex>
  );
}

interface MapItemProps {
  item: Extract<ConfigItem, { kind: "map" }>;
  options: FormatOptions;
  onChange: (options: FormatOptions) => void;
}

function MapItem({ item, options, onChange }: MapItemProps) {
  return (
    <Flex vertical gap={8}>
      <Flex align="center" justify="space-between">
        <Flex vertical style={{ minWidth: 0 }}>
          <Typography.Text strong>{item.label}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {item.description}
          </Typography.Text>
        </Flex>
        <Switch
          checked={options[item.enabledKey]}
          onChange={(checked) =>
            onChange({ ...options, [item.enabledKey]: checked })
          }
        />
      </Flex>
      <MapEditor
        fromLabel={item.fromLabel}
        toLabel={item.toLabel}
        value={options[item.key]}
        onChange={(map) => onChange({ ...options, [item.key]: map })}
      />
    </Flex>
  );
}

export const ConfigPanel = ({ options, onChange }: ConfigPanelProps) => {
  const { token } = theme.useToken();

  return (
    <Collapse
      ghost
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
            <Flex vertical gap={24}>
              {configGroups.map((group) => (
                <section key={group.id}>
                  <Typography.Text strong style={{ fontSize: 13 }}>
                    {group.title}
                  </Typography.Text>
                  <Divider style={{ margin: "8px 0 16px" }} />
                  <Row gutter={[16, 16]}>
                    {group.items.map((item) =>
                      item.kind === "switch" ? (
                        <Col
                          key={item.key}
                          xs={24}
                          sm={24}
                          md={12}
                          lg={8}
                          xl={6}
                        >
                          <SwitchItem
                            item={item}
                            options={options}
                            onChange={onChange}
                          />
                        </Col>
                      ) : (
                        <Col key={item.key} span={24}>
                          <MapItem
                            item={item}
                            options={options}
                            onChange={onChange}
                          />
                        </Col>
                      ),
                    )}
                  </Row>
                </section>
              ))}
            </Flex>
          ),
        },
      ]}
    />
  );
};

export default ConfigPanel;
