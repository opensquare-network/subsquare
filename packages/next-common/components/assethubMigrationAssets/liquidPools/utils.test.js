import { describe, expect, it } from "vitest";
import { formatPermillPercent } from "./utils";

describe("formatPermillPercent", () => {
  it("formats a Permill as a percent", () => {
    expect(formatPermillPercent(3000)).toBe("0.3%");
    expect(formatPermillPercent(1_000_000)).toBe("100%");
    expect(formatPermillPercent(0)).toBe("0%");
    expect(formatPermillPercent(null)).toBeNull();
  });
});
