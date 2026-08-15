import { Flex, Typography } from "antd";
import { theme as antdTheme } from "antd";

declare const __COMMIT_HASH__: string;
declare const __GITHUB_REPO_URL__: string;

export function AppFooter() {
  const { token } = antdTheme.useToken();

  return (
    <Flex
      justify="center"
      style={{
        padding: "8px 16px",
        borderTop: `1px solid ${token.colorBorderSecondary}`,
        backgroundColor: token.colorBgContainer,
      }}
    >
      <Typography.Text type="secondary" style={{ fontSize: 12 }}>
        <a
          href={__GITHUB_REPO_URL__}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: token.colorTextSecondary }}
        >
          GitHub
        </a>
        &nbsp;|&nbsp;Commit: {__COMMIT_HASH__}
      </Typography.Text>
    </Flex>
  );
}
