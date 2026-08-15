import { execSync } from "child_process";

import babel from "@rolldown/plugin-babel";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig } from "vite";

function getCommitHash() {
  try {
    return execSync("git rev-parse --short HEAD").toString().trim();
  } catch {
    return "Unknown";
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  define: {
    __COMMIT_HASH__: JSON.stringify(getCommitHash()),
    __GITHUB_REPO_URL__: JSON.stringify(
      "https://github.com/weilycoder/md-article-formatter",
    ),
  },
});
