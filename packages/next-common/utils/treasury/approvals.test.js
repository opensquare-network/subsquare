import { describe, expect, it } from "vitest";
import { hasTreasuryApprovals } from "./approvals";

describe("hasTreasuryApprovals", () => {
  it("defaults to the legacy approvals flow", () => {
    expect(hasTreasuryApprovals(undefined)).toBe(true);
    expect(hasTreasuryApprovals({})).toBe(true);
    expect(hasTreasuryApprovals({ modules: { treasury: {} } })).toBe(true);
    expect(
      hasTreasuryApprovals({ modules: { treasury: { approvals: true } } }),
    ).toBe(true);
  });

  it("is off once a chain switches to the AssetHub spend flow", () => {
    expect(
      hasTreasuryApprovals({ modules: { treasury: { approvals: false } } }),
    ).toBe(false);
  });
});
