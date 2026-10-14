import { describe, expect, it } from "vitest";
import {
  assetIndexFromLocation,
  buildLocalAssetLocation,
  buildPsmData,
  computeEffectiveCaps,
  formatPercent,
  isLocalAssetLocation,
  MIN_MAX_FEE_PERMILL,
  normalizeAssetId,
  parseAssetAmount,
  parsePalletsOrigin,
  permillRange,
  permillToPercent,
  pickDefaultExternal,
  resolveMaxFeePermill,
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

// papi decodes the junction value as a BigInt before the page runs it through toJsonSafe.
const usdtLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 1984n },
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
    // The raw Permill parts, which psm.mint takes as max_fee.
    expect(data.externals[0].mintingFeePermill).toBe(0);
    expect(data.externals[0].redemptionFee.toFixed()).toBe("0.01");
    // RedemptionFee = 100 permill.
    expect(data.externals[0].redemptionFeePermill).toBe(100);
    // The location passed to the popup must stay JSON serialisable.
    expect(JSON.stringify(data.externals[0].location)).toContain("\"1984\"");
  });

  it("returns null without a PSM instance", () => {
    expect(buildPsmData({})).toBeNull();
  });
});

// The helpers both swap directions share. `usdtLocation` above carries a BigInt GeneralIndex,
// which is how papi decodes it before the page runs it through toJsonSafe.
describe("normalizeAssetId", () => {
  it("accepts the shapes the page holds", () => {
    expect(normalizeAssetId(1984)).toBe(1984);
    expect(normalizeAssetId(1984n)).toBe(1984);
    expect(normalizeAssetId("1984")).toBe(1984);
  });

  it("refuses anything that is not a whole asset id", () => {
    expect(normalizeAssetId(null)).toBeNull();
    expect(normalizeAssetId(undefined)).toBeNull();
    expect(normalizeAssetId("")).toBeNull();
    expect(normalizeAssetId("abc")).toBeNull();
    expect(normalizeAssetId(-1)).toBeNull();
    expect(normalizeAssetId(1.5)).toBeNull();
  });
});

describe("buildLocalAssetLocation", () => {
  it("builds the location polkadot-js encodes for psm.mint and psm.redeem", () => {
    expect(buildLocalAssetLocation(7873)).toEqual({
      parents: 0,
      interior: {
        X2: [{ PalletInstance: 50 }, { GeneralIndex: 7873 }],
      },
    });
  });

  it("does not leak papi's enum shape into the transaction argument", () => {
    const location = buildLocalAssetLocation(1984);

    // The decoded shape ({type, value}) is what polkadot-js fails to decode, so the built
    // location must not contain it anywhere.
    expect(JSON.stringify(location)).not.toContain("\"type\"");
    expect(JSON.stringify(location)).not.toContain("value");
  });

  it("returns null for an id that cannot be encoded", () => {
    expect(buildLocalAssetLocation(null)).toBeNull();
    expect(buildLocalAssetLocation("abc")).toBeNull();
  });
});

describe("isLocalAssetLocation", () => {
  it("accepts the live Asset Hub locations", () => {
    expect(isLocalAssetLocation(dotUsdLocation)).toBe(true);
    expect(isLocalAssetLocation(usdtLocation)).toBe(true);
  });

  it("refuses anything that is not a local asset", () => {
    expect(isLocalAssetLocation(null)).toBe(false);
    expect(
      isLocalAssetLocation({ parents: 1, interior: usdtLocation.interior }),
    ).toBe(false);
    expect(
      isLocalAssetLocation({ parents: 0, interior: { type: "Here", value: [] } }),
    ).toBe(false);
    expect(
      isLocalAssetLocation({
        parents: 0,
        interior: {
          type: "X2",
          value: [
            { type: "PalletInstance", value: 20 },
            { type: "GeneralIndex", value: 1 },
          ],
        },
      }),
    ).toBe(false);
    expect(
      isLocalAssetLocation({
        parents: 0,
        interior: { type: "X1", value: [{ type: "PalletInstance", value: 50 }] },
      }),
    ).toBe(false);
  });
});

describe("resolveMaxFeePermill", () => {
  it("floors the pair's fee so the value is always accepted", () => {
    // MintingFee = 0 permill on the live instance, so the floor is what gets sent.
    expect(resolveMaxFeePermill(0)).toBe(MIN_MAX_FEE_PERMILL);
    expect(resolveMaxFeePermill(null)).toBe(MIN_MAX_FEE_PERMILL);
    expect(resolveMaxFeePermill(undefined)).toBe(MIN_MAX_FEE_PERMILL);
    // Pinned: 0.1%.
    expect(resolveMaxFeePermill(0)).toBe(1_000);
  });

  it("follows the fee up when it rises above the floor", () => {
    // A max fee below the pair's fee would be rejected with FeeTooHigh.
    expect(resolveMaxFeePermill(10_000)).toBe(10_000);
    expect(resolveMaxFeePermill(1_000_000)).toBe(1_000_000);
  });
});

describe("parseAssetAmount", () => {
  it("separates a blank field from an invalid one", () => {
    expect(parseAssetAmount("", 6)).toEqual({
      amount: null,
      isEmpty: true,
      error: null,
    });
    expect(parseAssetAmount("  ", 6).isEmpty).toBe(true);
    expect(parseAssetAmount("abc", 6)).toMatchObject({
      isEmpty: false,
      error: "Invalid amount",
    });
    expect(parseAssetAmount("0", 6)).toMatchObject({ error: "Invalid amount" });
    expect(parseAssetAmount("-1", 6)).toMatchObject({ error: "Invalid amount" });
  });

  it("scales to planck", () => {
    expect(parseAssetAmount("1", 6).amount).toBe(1_000_000n);
    expect(parseAssetAmount("1.234567", 6).amount).toBe(1_234_567n);
    expect(parseAssetAmount("1.", 6).amount).toBe(1_000_000n);
  });

  it("refuses more decimals than the asset has", () => {
    expect(parseAssetAmount("1.0000001", 6)).toMatchObject({
      error: "Only 6 decimals are supported",
    });
  });

  it("refuses an amount the chain could not encode", () => {
    // u128 max is ~3.4e38 planck, i.e. ~3.4e32 whole tokens at 6 decimals.
    expect(parseAssetAmount("1e40", 6)).toMatchObject({
      error: "Amount is too large",
    });
    expect(parseAssetAmount("1e30", 6).amount).toBe(10n ** 36n);
  });
});

describe("pickDefaultExternal", () => {
  const mintable = { index: 1984, status: "AllEnabled" };
  const stopped = { index: 5, status: "MintingDisabled" };

  it("keeps the user's selection while it still exists", () => {
    expect(pickDefaultExternal([mintable, stopped], 5)).toBe(stopped);
  });

  it("prefers a mintable asset, then any asset", () => {
    expect(pickDefaultExternal([stopped, mintable])).toBe(mintable);
    expect(pickDefaultExternal([stopped])).toBe(stopped);
    expect(pickDefaultExternal([])).toBeNull();
  });

  it("falls back when the selection is gone", () => {
    expect(pickDefaultExternal([mintable], 999)).toBe(mintable);
  });
});

