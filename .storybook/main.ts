import type { StorybookConfig } from "@storybook/react-vite";
import { mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const config: StorybookConfig = {
  // ✅ FSD 전 레이어에서 *.stories.* / *.mdx 수집
  stories: [
    "../src/**/*.mdx",
    // "../src/**/*.stories.@(js|jsx|mjs|ts|tsx)",
    "../src/shared/**/*.stories.@(ts|tsx|mdx)",
    "../src/entities/**/*.stories.@(ts|tsx|mdx)",
    "../src/features/**/*.stories.@(ts|tsx|mdx)",
    "../src/widgets/**/*.stories.@(ts|tsx|mdx)",
    "../src/pages/**/*.stories.@(ts|tsx|mdx)",
  ],
  addons: [
    "@chromatic-com/storybook",
    "@storybook/addon-vitest",
    "@storybook/addon-a11y",
    "@storybook/addon-docs",
    // "@storybook/addon-essentials",
  ],
  framework: "@storybook/react-vite",
  // ✅ Vite alias(@/*)가 Storybook에서도 먹게 보강
  async viteFinal(cfg) {
    return mergeConfig(cfg, { plugins: [tsconfigPaths()] });
  },
};
export default config;
