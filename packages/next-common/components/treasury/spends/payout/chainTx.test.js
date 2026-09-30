import { describe, expect, it, vi } from "vitest";
import { getPayoutActionCall, getPayoutActionTx } from "./chainTx";

describe("getPayoutActionCall", () => {
  it("maps spend status to @polkadot/api call names", () => {
    expect(getPayoutActionCall("Pending")).toBe("payout");
    expect(getPayoutActionCall("Failed")).toBe("payout");
    expect(getPayoutActionCall("Attempted")).toBe("checkStatus");
  });

  it("returns null for unknown status", () => {
    expect(getPayoutActionCall(null)).toBeNull();
    expect(getPayoutActionCall("Paid")).toBeNull();
  });
});

describe("getPayoutActionTx", () => {
  it("builds a payout tx for pending and failed spends", () => {
    const payout = vi.fn((index) => ({ call: "payout", index }));
    const api = { tx: { treasury: { payout } } };

    expect(getPayoutActionTx(api, "treasury", "Pending", 7)).toEqual({
      call: "payout",
      index: 7,
    });
    expect(getPayoutActionTx(api, "treasury", "Failed", 7)).toEqual({
      call: "payout",
      index: 7,
    });
    expect(payout).toHaveBeenCalledTimes(2);
  });

  it("builds a checkStatus tx for attempted spends", () => {
    const checkStatus = vi.fn((index) => ({ call: "checkStatus", index }));
    const api = { tx: { treasury: { checkStatus } } };

    expect(getPayoutActionTx(api, "treasury", "Attempted", 9)).toEqual({
      call: "checkStatus",
      index: 9,
    });
  });

  it("returns null when the call is not available on the runtime", () => {
    expect(
      getPayoutActionTx({ tx: { treasury: {} } }, "treasury", "Attempted", 9),
    ).toBeNull();
    expect(getPayoutActionTx(null, "treasury", "Pending", 9)).toBeNull();
    expect(
      getPayoutActionTx({ tx: {} }, "treasury", "Pending", undefined),
    ).toBeNull();
  });
});
