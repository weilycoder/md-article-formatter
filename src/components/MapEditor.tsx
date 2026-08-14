import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Input, Switch, Typography } from "antd";
import { useEffect, useState } from "react";

import type { MapEntry } from "../formatter/formatter";

interface MapEditorProps {
  fromLabel: string;
  toLabel: string;
  value: MapEntry[];
  onChange: (value: MapEntry[]) => void;
  rowValidator?: (from: string, to: string) => boolean;
}

function toRecord(
  rows: MapEntry[],
  rowValidator?: (from: string, to: string) => boolean,
): MapEntry[] | undefined {
  const visited = new Set<string>();
  const record: MapEntry[] = [];
  for (const { from, enabled, to } of rows) {
    if (from === "" && to === "") return undefined;
    if (visited.has(from)) return undefined;
    if (rowValidator !== undefined && !rowValidator(from, to)) return undefined;
    visited.add(from);
    record.push({ enabled, from, to });
  }
  return record;
}

export function MapEditor({
  fromLabel,
  toLabel,
  value,
  onChange,
  rowValidator,
}: MapEditorProps) {
  const [rows, setRows] = useState<MapEntry[]>(() => value);

  if (rowValidator === undefined) rowValidator = () => true;

  useEffect(() => {
    setRows(value);
  }, [value]);

  const commit = (nextRows: MapEntry[]) => {
    setRows(nextRows);
    const record = toRecord(nextRows, rowValidator);
    if (record !== undefined) onChange(record);
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
        {rows.map((row, index) => {
          const isValid = rowValidator ? rowValidator(row.from, row.to) : true;
          const isDuplicate = rows
            .slice(0, index)
            .some((r) => r.from === row.from);
          return (
            <Flex key={index} align="center" gap={8}>
              <Input
                style={{ width: 88 }}
                value={row.from}
                placeholder={fromLabel}
                status={isValid && !isDuplicate ? undefined : "error"}
                onChange={(e) => updateFrom(index, e.target.value)}
              />
              <Typography.Text type="secondary">→</Typography.Text>
              <Input
                style={{ width: 88 }}
                value={row.to}
                placeholder={toLabel}
                status={isValid && !isDuplicate ? undefined : "error"}
                onChange={(e) => updateTo(index, e.target.value)}
              />
              {isDuplicate ? (
                <Typography.Text
                  type="danger"
                  style={{ fontSize: 10, width: 40 }}
                >
                  重复映射
                </Typography.Text>
              ) : !isValid ? (
                <Typography.Text
                  type="danger"
                  style={{ fontSize: 10, width: 40 }}
                >
                  无效映射
                </Typography.Text>
              ) : (
                <Switch
                  size="small"
                  checked={row.enabled}
                  onChange={(checked) => updateEnabled(index, checked)}
                  aria-label={`启用 ${row.from} 的替换`}
                  title={`启用 ${row.from} 的替换`}
                  style={{ width: 40 }}
                />
              )}
              <Button
                type="text"
                danger
                icon={<DeleteOutlined />}
                onClick={() => removeRow(index)}
                aria-label={`删除 ${fromLabel} 映射`}
                title={`删除 ${fromLabel} 映射`}
              />
            </Flex>
          );
        })}
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
