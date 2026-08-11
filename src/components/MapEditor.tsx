import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Switch, Typography } from "antd";
import { useEffect, useState } from "react";

import type { MapEntry } from "../formatter/formatter";

interface MapRow {
  from: string;
  enabled: boolean;
  to: string;
}

interface MapEditorProps {
  fromLabel: string;
  toLabel: string;
  value: Record<string, MapEntry>;
  onChange: (value: Record<string, MapEntry>) => void;
}

function toRows(value: Record<string, MapEntry>): MapRow[] {
  return Object.entries(value).map(([from, entry]) => ({
    from,
    enabled: entry.enabled,
    to: entry.to,
  }));
}

function toRecord(rows: MapRow[]): Record<string, MapEntry> {
  const record: Record<string, MapEntry> = {};
  for (const { from, enabled, to } of rows) {
    if (from === "" || to === "") continue;
    record[from] = { enabled, to };
  }
  return record;
}

export function MapEditor({
  fromLabel,
  toLabel,
  value,
  onChange,
}: MapEditorProps) {
  const [rows, setRows] = useState<MapRow[]>(() => toRows(value));

  useEffect(() => {
    setRows((prev) => {
      const committed = toRows(value);
      const pending = prev.filter((row) => row.from === "" || row.to === "");
      return [...committed, ...pending];
    });
  }, [value]);

  const commit = (nextRows: MapRow[]) => {
    setRows(nextRows);
    onChange(toRecord(nextRows));
  };

  const updateFrom = (index: number, from: string) => {
    commit(rows.map((row, i) => (i === index ? { ...row, from } : row)));
  };

  const updateTo = (index: number, to: string) => {
    commit(rows.map((row, i) => (i === index ? { ...row, to } : row)));
  };

  const updateEnabled = (index: number, enabled: boolean) => {
    commit(rows.map((row, i) => (i === index ? { ...row, enabled } : row)));
  };

  const removeRow = (index: number) => {
    commit(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setRows([...rows, { from: "", enabled: true, to: "" }]);
  };

  return (
    <Flex vertical gap={8}>
      <Flex wrap gap={8}>
        {rows.map((row, index) => (
          <Flex key={index} align="center" gap={8}>
            <Input
              style={{ width: 88 }}
              value={row.from}
              placeholder={fromLabel}
              onChange={(e) => updateFrom(index, e.target.value)}
            />
            <Typography.Text type="secondary">→</Typography.Text>
            <Input
              style={{ width: 88 }}
              value={row.to}
              placeholder={toLabel}
              onChange={(e) => updateTo(index, e.target.value)}
            />
            <Switch
              size="small"
              checked={row.enabled}
              onChange={(checked) => updateEnabled(index, checked)}
              aria-label={`启用 ${row.from} 的替换`}
              title={`启用 ${row.from} 的替换`}
            />
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => removeRow(index)}
              aria-label={`删除 ${fromLabel} 映射`}
              title={`删除 ${fromLabel} 映射`}
            />
          </Flex>
        ))}
      </Flex>
      {rows.length === 0 && (
        <Typography.Text type="secondary" style={{ fontSize: 12 }}>
          暂无映射，点击“添加”新增规则
        </Typography.Text>
      )}
      <Flex justify="flex-end" gap={8}>
        <Button size="small" icon={<PlusOutlined />} onClick={addRow}>
          添加
        </Button>
        <Button
          size="small"
          icon={<DeleteOutlined />}
          onClick={() => commit([])}
          danger
        >
          清空
        </Button>
      </Flex>
    </Flex>
  );
}

export default MapEditor;
