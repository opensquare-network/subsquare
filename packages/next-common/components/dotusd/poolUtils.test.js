import { describe, expect, it } from "vitest";
import { fetchDotUsdPools } from "./poolUtils";

const nativeLocation = {
  parents: 0,
  interior: { type: "Here", value: undefined },
};
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
const usdtLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 1984 },
    ],
  },
};
const usdcLocation = {
  parents: 0,
  interior: {
    type: "X2",
    value: [
      { type: "PalletInstance", value: 50 },
      { type: "GeneralIndex", value: 1337 },
    ],
  },
};

function symbolBytes(symbol) {
  return new TextEncoder().encode(symbol);
}

function buildApi({ poolEntries = [], balances = {}, metadatas = {} } = {}) {
  return {
    query: {
      AssetConversion: {
        Pools: {
          getEntries: async () => poolEntries,
        },
      },
      PoolAssets: {
        Asset: {
          getValue: async (poolAssetId) => ({ owner: `owner-${poolAssetId}` }),
        },
      },
      System: {
        Account: {
          getValue: async (address) => balances[`native:${address}`] ?? null,
        },
      },
      Assets: {
        Account: {
          getValue: async (assetId, address) =>
            balances[`asset:${assetId}:${address}`] ?? null,
        },
        Metadata: {
          getValue: async (assetId) => metadatas[assetId] ?? null,
        },
      },
      ForeignAssets: {
        Account: {
          getValue: async () => null,
        },
        Metadata: {
          getValue: async () => null,
        },
      },
    },
    constants: {
      AssetConversion: {
        LPFee: async () => 3000,
      },
    },
  };
}

const nativeSettings = { dotSymbol: "DOT", dotDecimals: 10 };

describe("fetchDotUsdPools", () => {
  it("returns every pool that holds dotUSD, dotUSD side last", async () => {
    const api = buildApi({
      poolEntries: [
        {
          keyArgs: [[nativeLocation, dotUsdLocation]],
          value: 100,
        },
        {
          // Stored in the reverse order, the row must still read "USDt / dotUSD".
          keyArgs: [[dotUsdLocation, usdtLocation]],
          value: 101,
        },
        {
          // Pool without dotUSD.
          keyArgs: [[nativeLocation, usdcLocation]],
          value: 102,
        },
      ],
      metadatas: {
        7873: { symbol: symbolBytes("dotUSD"), decimals: 6 },
        1984: { symbol: symbolBytes("USDt"), decimals: 6 },
      },
      balances: {
        "native:owner-100": {
          data: { free: 100_000_000_000_000n, frozen: 0n },
        },
        "asset:7873:owner-100": {
          balance: 3_000_000_000n,
          status: { type: "Liquid" },
        },
        "asset:1984:owner-101": {
          balance: 4_000_000_000n,
          status: { type: "Liquid" },
        },
        "asset:7873:owner-101": {
          balance: 2_000_000_000n,
          status: { type: "Liquid" },
        },
      },
    });

    const pools = await fetchDotUsdPools(api, nativeSettings);

    expect(pools.map((pool) => pool.poolAssetId)).toEqual([100, 101]);

    const dotPool = pools[0];
    expect(dotPool.otherToken).toMatchObject({
      type: "native",
      key: "native",
      symbol: "DOT",
      decimals: 10,
    });
    expect(dotPool.dotUsdToken).toMatchObject({
      type: "asset",
      key: "asset:7873",
      symbol: "dotUSD",
      decimals: 6,
    });
    expect(dotPool.otherReserve.toString()).toBe("10000");
    expect(dotPool.dotUsdReserve.toString()).toBe("3000");
    expect(dotPool.price.toString()).toBe("0.3");
    expect(dotPool.tvl.toString()).toBe("6000");
    expect(dotPool.lpFee).toBe(3000);

    const usdtPool = pools[1];
    expect(usdtPool.otherToken).toMatchObject({
      type: "asset",
      key: "asset:1984",
      symbol: "USDt",
      decimals: 6,
    });
    expect(usdtPool.otherReserve.toString()).toBe("4000");
    expect(usdtPool.dotUsdReserve.toString()).toBe("2000");
    expect(usdtPool.price.toString()).toBe("0.5");
    expect(usdtPool.tvl.toString()).toBe("4000");
  });

  it("returns nothing when no pool holds dotUSD", async () => {
    const api = buildApi({
      poolEntries: [{ keyArgs: [[nativeLocation, usdcLocation]], value: 102 }],
    });

    await expect(fetchDotUsdPools(api, nativeSettings)).resolves.toEqual([]);
  });

  it("skips a pool whose lp token is missing", async () => {
    const api = buildApi({
      poolEntries: [
        { keyArgs: [[nativeLocation, dotUsdLocation]], value: undefined },
      ],
    });

    await expect(fetchDotUsdPools(api, nativeSettings)).resolves.toEqual([]);
  });
});
