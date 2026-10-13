import { describe, expect, it } from "vitest";
import {
  assetIndexFromLocation,
  buildPsmData,
  computeEffectiveCaps,
  formatPercent,
  permillRange,
  permillToPercent,
  parsePalletsOrigin,
  sumValues,
  utilizationPercent,
  symbolOf,
  toJsonSafe,
} from "./psmUtils";

// Values below are copied from Polkadot Asset Hub storage reads.
const dotUsdLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 7873 },
    ],
  },
};

describe("assetIndexFromLocation", () => {
  it("reads the asset index of an Asset Hub location", () => {
    expect(assetIndexFromLocation(dotUsdLocation)).toBe(7873);
  });

  it("returns null when there is no general index", () => {
    expect(assetIndexFromLocation({ interior: { value: [] } })).toBeNull();
    expect(assetIndexFromLocation(null)).toBeNull();
  });
});

describe("symbolOf", () => {
  it("decodes a byte symbol", () => {
    // Assets.Metadata(7873).symbol
    expect(symbolOf({ symbol: [100, 111, 116, 85, 83, 68] })).toBe("dotUSD");
  });

  it("keeps a string symbol", () => {
    expect(symbolOf({ symbol: "USDT" })).toBe("USDT");
  });

  it("returns null without a symbol", () => {
    expect(symbolOf(null)).toBeNull();
    expect(symbolOf({})).toBeNull();
  });
});

describe("permill conversions", () => {
  it("converts the real fees to percents", () => {
    // MintingFee = 0 permill, RedemptionFee = 100 permill
    expect(permillToPercent(0).toFixed()).toBe("0");
    expect(permillToPercent(100).toFixed()).toBe("0.01");
    expect(permillToPercent(1_000_000).toFixed()).toBe("100");
  });

  it("builds a range over several assets", () => {
    const range = permillRange([{ value: 0 }, { value: 100 }]);

    expect(range.min.toFixed()).toBe("0");
    expect(range.max.toFixed()).toBe("0.01");
  });

  it("returns null without entries", () => {
    expect(permillRange([])).toBeNull();
    expect(permillRange(null)).toBeNull();
  });
});

describe("sumValues", () => {
  it("sums the debt entries", () => {
    // PsmDebt of the dotUSD instance
    expect(sumValues([{ value: "2996624883933" }]).toFixed()).toBe(
      "2996624883933",
    );
    expect(sumValues([{ value: "1" }, { value: "2" }]).toFixed()).toBe("3");
  });
});

describe("toJsonSafe", () => {
  it("converts BigInt junction values so the location can be serialised", () => {
    // PAPI decodes GeneralIndex as BigInt, which breaks the JSON view of the location
    // popup and crashed the page.
    const location = {
      parents: 0,
      interior: {
        type: "X2",
        value: [
          { type: "PalletInstance", value: 50 },
          { type: "GeneralIndex", value: 7873n },
        ],
      },
    };

    expect(() => JSON.stringify(location)).toThrow(/BigInt/);

    const safe = toJsonSafe(location);
    expect(JSON.stringify(safe)).toContain("\"7873\"");
    expect(assetIndexFromLocation(safe)).toBe(7873);
  });
});

describe("parsePalletsOrigin", () => {
  // Both values are read from the dotUSD PSM instance on Polkadot Asset Hub.
  it("names a governance origin", () => {
    expect(
      parsePalletsOrigin({ type: "system", value: { type: "Root" } }),
    ).toEqual({ type: "origin", label: "system · Root" });
    expect(
      parsePalletsOrigin({ type: "Origins", value: { type: "ProsperityEmergency" } }),
    ).toEqual({ type: "origin", label: "Origins · ProsperityEmergency" });
  });

  it("returns the account of a signed origin", () => {
    const account = "13UVJyLkBsKdkhA6hcHAA9jmz4hJe7iRJ6r9ZUwQheobW7cL";

    expect(
      parsePalletsOrigin({ type: "system", value: { type: "Signed", value: account } }),
    ).toEqual({ type: "account", account });
    expect(
      parsePalletsOrigin({
        type: "system",
        value: { type: "Signed", value: { value: account } },
      }),
    ).toEqual({ type: "account", account });
  });

  it("returns null without an origin", () => {
    expect(parsePalletsOrigin(null)).toBeNull();
    expect(parsePalletsOrigin({})).toBeNull();
  });
});

describe("formats and caps", () => {
  // dotUSD instance on Polkadot Asset Hub: max debt 10,000,000 (6 decimals), one external
  // asset holding the full ceiling weight, with 2,996,624.883933 dotUSD minted against it.
  const maxDebt = "10000000000000";
  const debt = "2996624883933";

  it("gives a sole external asset the whole ceiling", () => {
    const [cap] = computeEffectiveCaps(maxDebt, [1000000]);
    expect(cap.toFixed(0)).toBe(maxDebt);
    expect(utilizationPercent(debt, cap).toFixed(2)).toBe("29.97");
  });

  it("splits the ceiling by weight", () => {
    const [first, second] = computeEffectiveCaps(maxDebt, [500000, 500000]);
    expect(first.toFixed(0)).toBe("5000000000000");
    expect(second.toFixed(0)).toBe("5000000000000");
  });

  it("normalises against the weights that are set, and blocks a zero weight", () => {
    // A zero weight cannot mint, so the remaining weight takes the whole ceiling.
    const [onlyAsset, blocked] = computeEffectiveCaps(maxDebt, [500000, 0]);
    expect(onlyAsset.toFixed(0)).toBe(maxDebt);
    expect(blocked.toFixed(0)).toBe("0");
    expect(computeEffectiveCaps(maxDebt, [0, 0])).toEqual([null, null]);
  });

  it("formats percents", () => {
    expect(formatPercent(29.96624883933, 2)).toBe("29.97%");
    expect(formatPercent(0.01)).toBe("0.01%");
    expect(formatPercent(0)).toBe("0%");
    expect(formatPercent(100)).toBe("100%");
    expect(formatPercent(null)).toBeNull();
  });

  it("returns no utilization without a cap", () => {
    expect(utilizationPercent(debt, null)).toBeNull();
    expect(utilizationPercent(debt, 0)).toBeNull();
  });
});

describe("buildPsmData", () => {
  // Entry shapes follow the Polkadot Asset Hub reads.
  const internal = {
    parents: 0,
    interior: {
      type: "X2",
      value: [
        { type: "PalletInstance", value: 50 },
        { type: "GeneralIndex", value: 7873n },
      ],
    },
  };
  const external = {
    parents: 0,
    interior: {
      type: "X2",
      value: [
        { type: "PalletInstance", value: 50 },
        { type: "GeneralIndex", value: 1984n },
      ],
    },
  };
  const entries = {
    psmEntries: [
      {
        keyArgs: [internal],
        value: {
          fee_destination: "13UVJyLkBsKdkhA6hcHAA9jmz4hJe7iRJ6r9ZUwQheobW7cL",
          max_debt: 10000000000000n,
          min_swap_amount: 1000000n,
          internal_decimals: 6,
          external_count: 1,
        },
      },
    ],
    externalEntries: [
      { keyArgs: [internal, external], value: { status: { type: "AllEnabled" }, decimals: 6 } },
    ],
    weightEntries: [{ keyArgs: [internal, external], value: 1000000 }],
    debtEntries: [{ keyArgs: [internal, external], value: 2996624883933n }],
    feeEntries: [{ keyArgs: [internal, external], value: 0 }],
    redemptionEntries: [{ keyArgs: [internal, external], value: 100 }],
    adminEntries: [
      {
        keyArgs: [internal],
        value: {
          full_admin: { type: "system", value: { type: "Root" } },
          emergency_admin: { type: "Origins", value: { type: "ProsperityEmergency" } },
        },
      },
    ],
    assetMetadata: new Map([
      [7873, { symbol: [100, 111, 116, 85, 83, 68], decimals: 6 }],
      [1984, { symbol: [85, 83, 68, 116], decimals: 6 }],
    ]),
  };

  it("assembles the instance, its externals and the totals", () => {
    const data = buildPsmData(entries);

    expect(data.internalAsset).toMatchObject({ index: 7873, symbol: "dotUSD" });
    expect(data.maxDebt).toBe("10000000000000");
    expect(data.minSwapAmount).toBe("1000000");
    expect(data.externalCount).toBe(1);
    expect(data.feeDestination).toBe(
      "13UVJyLkBsKdkhA6hcHAA9jmz4hJe7iRJ6r9ZUwQheobW7cL",
    );
    // The debt total comes from the pair entries, not from the index map.
    expect(data.totalDebt).toBe("2996624883933");
    expect(data.fullAdmin).toEqual({ type: "origin", label: "system · Root" });
    expect(data.emergencyAdmin).toEqual({
      type: "origin",
      label: "Origins · ProsperityEmergency",
    });

    expect(data.externals).toHaveLength(1);
    expect(data.externals[0]).toMatchObject({
      index: 1984,
      // The on-chain symbol on Asset Hub is "USDt", the icon is matched by assetId.
      status: "AllEnabled",
      cap: "10000000000000",
      utilization: "29.97",
      debt: "2996624883933",
    });
    expect(data.externals[0].mintingFee.toFixed()).toBe("0");
    expect(data.externals[0].redemptionFee.toFixed()).toBe("0.01");
    // The location passed to the popup must stay JSON serialisable.
    expect(JSON.stringify(data.externals[0].location)).toContain("\"1984\"");
  });

  it("returns null without a PSM instance", () => {
    expect(buildPsmData({})).toBeNull();
  });
});
