import { Divider, Space, Typography } from "antd";

import { countWords } from "../utils";

const { Text } = Typography;

interface TokenCounterProps {
  text: string;
}

export function TokenCounter({ text }: TokenCounterProps) {
  return (
    <Space separator={<Divider orientation="vertical" />} size={4}>
      <Text type="secondary">
        行数 <Text strong>{text.split(/\n/).length}</Text>
      </Text>
      <Text type="secondary">
        字数 <Text strong>{countWords(text)}</Text>
      </Text>
      <Text type="secondary">
        字符 <Text strong>{text.length}</Text>
      </Text>
    </Space>
  );
}
