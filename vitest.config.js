import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    env: {
      CHAIN: "polkadot",
      NEXT_PUBLIC_CHAIN: "polkadot",
    },
  },
});
