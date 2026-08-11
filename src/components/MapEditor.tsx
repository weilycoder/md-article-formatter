import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Typography } from "antd";
import { useEffect, useState } from "react";

interface MapEntry {
  from: string;
  to: string;
}

interface MapEditorProps {
  title: string;
  description: string;
  fromLabel: string;
  toLabel: string;
  value: Record<string, string>;
  onChange: (value: Record<string, string>) => void;
}

function toRows(value: Record<string, string>): MapEntry[] {
  return Object.entries(value).map(([from, to]) => ({ from, to }));
}

function toRecord(rows: MapEntry[]): Record<string, string> {
  const record: Record<string, string> = {};
  for (const { from, to } of rows) {
    const key = from.trim();
    if (key === "" || to.trim() === "") continue;
    record[key] = to;
  }
  return record;
}

export function MapEditor({
  title,
  description,
  fromLabel,
  toLabel,
  value,
  onChange,
}: MapEditorProps) {
  const [rows, setRows] = useState<MapEntry[]>(() => toRows(value));

  useEffect(() => {
    setRows((prev) => {
      const committed = toRows(value);
      const pending = prev.filter(
        (row) => row.from.trim() === "" || row.to.trim() === "",
      );
      return [...committed, ...pending];
    });
  }, [value]);

  const commit = (nextRows: MapEntry[]) => {
    setRows(nextRows);
    onChange(toRecord(nextRows));
  };

  const updateFrom = (index: number, from: string) => {
    commit(rows.map((row, i) => (i === index ? { ...row, from } : row)));
  };

  const updateTo = (index: number, to: string) => {
    commit(rows.map((row, i) => (i === index ? { ...row, to } : row)));
  };

  const removeRow = (index: number) => {
    commit(rows.filter((_, i) => i !== index));
  };

  const addRow = () => {
    setRows([...rows, { from: "", to: "" }]);
  };

  return (
    <Flex vertical gap={8}>
      <Flex align="center" justify="space-between">
        <Flex vertical style={{ minWidth: 0 }}>
          <Typography.Text strong>{title}</Typography.Text>
          <Typography.Text type="secondary" style={{ fontSize: 12 }}>
            {description}
          </Typography.Text>
        </Flex>
        <Button size="small" icon={<PlusOutlined />} onClick={addRow}>
          添加
        </Button>
      </Flex>
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
    </Flex>
  );
}

export default MapEditor;
