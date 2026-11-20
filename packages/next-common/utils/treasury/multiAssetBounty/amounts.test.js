import { describe, expect, it } from "vitest";
import BigNumber from "bignumber.js";
import { getIncreasedBountyValue, getMultiAssetBountyAmounts } from "./amounts";

describe("getMultiAssetBountyAmounts", () => {
  it("registers funds held above the recorded value", () => {
    const amounts = getMultiAssetBountyAmounts({
      value: "1000",
      childBountiesValue: "400",
      balance: "700",
    });

    expect(amounts.available.toFixed()).toBe("600");
    expect(amounts.unregistered.toFixed()).toBe("100");
  });

  it("reports nothing to register when the balance matches the value", () => {
    const amounts = getMultiAssetBountyAmounts({
      value: "1000",
      childBountiesValue: "400",
      balance: "600",
    });

    expect(amounts.unregistered.toFixed()).toBe("0");
  });

  it("is negative when funds have not arrived yet", () => {
    const amounts = getMultiAssetBountyAmounts({
      value: "1000",
      childBountiesValue: "0",
      balance: "700",
    });

    expect(amounts.unregistered.toFixed()).toBe("-300");
    // Never offer more than the account actually holds.
    expect(amounts.available.toFixed()).toBe("700");
  });

  it("offers nothing for child bounties when children already use the value", () => {
    const amounts = getMultiAssetBountyAmounts({
      value: "1000",
      childBountiesValue: "1000",
      balance: "500",
    });

    expect(amounts.available.toFixed()).toBe("0");
    // The whole balance is unregistered: the recorded value is fully used.
    expect(amounts.unregistered.toFixed()).toBe("500");
  });

  it("treats missing data as zero", () => {
    const amounts = getMultiAssetBountyAmounts({});

    expect(amounts.available.toFixed()).toBe("0");
    expect(amounts.unregistered.toFixed()).toBe("0");
  });

  it("does not allow registering a child refund before status is checked", () => {
    const amounts = getMultiAssetBountyAmounts({
      value: "1000",
      childBountiesValue: "400",
      balance: "1000",
      refundPending: true,
    });

    expect(amounts.unregistered.toFixed()).toBe("400");
    expect(amounts.registerableAmount.toFixed()).toBe("0");
  });
});

describe("getIncreasedBountyValue", () => {
  it("waits for the recorded value to load before adding an amount", () => {
    expect(getIncreasedBountyValue(null, new BigNumber(100))).toBeNull();
    expect(
      getIncreasedBountyValue(
        new BigNumber(1000),
        new BigNumber(100),
      ).toFixed(),
    ).toBe("1100");
  });
});
