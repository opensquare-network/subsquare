import { describe, expect, it } from "vitest";
import {
  assetIndexFromLocation,
  permillRange,
  permillToPercent,
  sumValues,
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
