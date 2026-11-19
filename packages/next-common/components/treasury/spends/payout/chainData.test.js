import { describe, expect, it } from "vitest";
import {
  buildPayoutQueue,
  buildPayoutQueues,
  formatPayoutAmount,
  getAssetBalanceQuery,
  getAssetKindKey,
  getBalanceFromStorage,
  getEntryAssetKind,
  getNextPayoutAction,
  getNextPayoutCountdown,
  getPapiAssetKindInfo,
  getPayoutAction,
  getPayoutActionLabel,
  getPayoutSpendStatus,
  getPayoutSpendTitle,
  isPayoutBalanceInsufficient,
} from "./chainData";

const HERE = { parents: 0, interior: { type: "Here" } };

function palletAssetLocation(assetId) {
  return {
    parents: 0,
    interior: {
      type: "X2",
      value: [
        { type: "PalletInstance", value: 50 },
        { type: "GeneralIndex", value: BigInt(assetId) },
      ],
    },
  };
}

const usdtAssetKind = {
  type: "V5",
  value: { location: HERE, asset_id: palletAssetLocation(1984) },
};

const dotAssetKind = {
  type: "V5",
  value: { location: HERE, asset_id: HERE },
};

const hollarAssetKind = {
  type: "V5",
  value: {
    location: HERE,
    asset_id: {
      parents: 1,
      interior: {
        type: "X2",
        value: [
          { type: "Parachain", value: 2034 },
          { type: "GeneralIndex", value: 222n },
        ],
      },
    },
  },
};

const v5UsdcAssetKind = {
  type: "V5",
  value: { location: HERE, asset_id: palletAssetLocation(1337) },
};

const v4UsdcAssetKind = {
  type: "V4",
  value: {
    location: HERE,
    asset_id: {
      parents: 0,
      interior: {
        type: "X2",
        value: [
          { type: "PalletInstance", value: 50 },
          { type: "GeneralIndex", value: 1337n },
        ],
      },
    },
  },
};

function spendStatus(type, value) {
  return value === undefined ? { type } : { type, value };
}

describe("getPayoutSpendStatus", () => {
  it("maps papi enum shapes", () => {
    expect(getPayoutSpendStatus(spendStatus("Pending"))).toBe("Pending");
    expect(getPayoutSpendStatus(spendStatus("Failed"))).toBe("Failed");
    expect(getPayoutSpendStatus(spendStatus("Attempted", { id: 1n }))).toBe(
      "Attempted",
    );
    expect(getPayoutSpendStatus(spendStatus("Attempted", 1))).toBe("Attempted");
  });

  it("maps plain strings used by demo data", () => {
    expect(getPayoutSpendStatus("Pending")).toBe("Pending");
    expect(getPayoutSpendStatus("Unknown")).toBeNull();
  });

  it("returns null for missing status", () => {
    expect(getPayoutSpendStatus(undefined)).toBeNull();
    expect(getPayoutSpendStatus({})).toBeNull();
  });
});

describe("getPayoutActionLabel", () => {
  it("maps status to action label", () => {
    expect(getPayoutActionLabel("Pending")).toBe("Payout");
    expect(getPayoutActionLabel("Failed")).toBe("Retry Payment");
    expect(getPayoutActionLabel("Attempted")).toBe("Check Status");
    expect(getPayoutActionLabel(null)).toBeNull();
  });
});

describe("getPapiAssetKindInfo", () => {
  const chain = { chainSymbol: "DOT", chainDecimals: 10 };

  it("resolves native asset", () => {
    expect(getPapiAssetKindInfo(dotAssetKind, chain)).toEqual({
      isLocal: true,
      isNative: true,
      isPalletAsset: false,
      assetId: null,
      symbol: "DOT",
      decimals: 10,
      label: "Native",
      version: "V5",
    });
  });

  it("resolves known pallet assets", () => {
    expect(getPapiAssetKindInfo(usdtAssetKind, chain)).toEqual({
      isLocal: true,
      isNative: false,
      isPalletAsset: true,
      assetId: 1984,
      symbol: "USDT",
      decimals: 6,
      label: "ForeignAsset #1984",
      version: "V5",
    });

    expect(getPapiAssetKindInfo(v4UsdcAssetKind, chain).symbol).toBe("USDC");
  });

  it("does not assume native decimals for unknown assets", () => {
    const info = getPapiAssetKindInfo(
      {
        type: "V5",
        value: {
          location: HERE,
          asset_id: palletAssetLocation(7777),
        },
      },
      chain,
    );
    expect(info.symbol).toBe("#7777");
    expect(info.label).toBe("ForeignAsset #7777");
    expect(info.isPalletAsset).toBe(true);
    expect(info.decimals).toBeNull();
  });

  it("labels foreign location assets", () => {
    const info = getPapiAssetKindInfo(hollarAssetKind, chain);
    expect(info.isNative).toBe(false);
    expect(info.isPalletAsset).toBe(false);
    expect(info.symbol).toBe("#222");
    expect(info.label).toBe("ForeignAsset #222 (parachain 2034)");
    expect(info.decimals).toBeNull();
  });

  it("does not treat another chain's asset id as a local asset", () => {
    const remoteAssetKind = {
      type: "V5",
      value: {
        location: {
          parents: 1,
          interior: { type: "Parachain", value: 1000 },
        },
        asset_id: palletAssetLocation(1984),
      },
    };
    const info = getPapiAssetKindInfo(remoteAssetKind, chain);
    expect(info.isLocal).toBe(false);
    expect(info.isPalletAsset).toBe(false);
    expect(info.symbol).toBe("#1984");
  });
});

describe("getAssetBalanceQuery", () => {
  it("returns system account for native", () => {
    expect(getAssetBalanceQuery(dotAssetKind)).toEqual({
      pallet: "System",
      args: [],
    });
  });

  it("returns assets account for pallet assets", () => {
    expect(getAssetBalanceQuery(usdtAssetKind)).toEqual({
      pallet: "Assets",
      args: [1984],
    });
  });

  it("returns foreign assets account for other locations", () => {
    const query = getAssetBalanceQuery(hollarAssetKind);
    expect(query.pallet).toBe("ForeignAssets");
    expect(query.args).toHaveLength(1);
    expect(query.args[0].parents).toBe(1);
  });

  it("returns null when the reserve is another chain", () => {
    expect(
      getAssetBalanceQuery({
        type: "V5",
        value: {
          location: {
            parents: 1,
            interior: { type: "Parachain", value: 1000 },
          },
          asset_id: palletAssetLocation(1984),
        },
      }),
    ).toBeNull();
  });
});

describe("getBalanceFromStorage", () => {
  it("reads native free balance", () => {
    expect(getBalanceFromStorage("System", { data: { free: 123n } })).toBe(
      123n,
    );
  });

  it("reads asset balance", () => {
    expect(getBalanceFromStorage("Assets", { balance: 456n })).toBe(456n);
  });

  it("returns null for empty values", () => {
    expect(getBalanceFromStorage("System", undefined)).toBeNull();
    expect(getBalanceFromStorage("Assets", null)).toBeNull();
  });
});

describe("getAssetKindKey", () => {
  it("is stable for equal, separately decoded values", () => {
    const a = { type: "V5", value: { asset_id: palletAssetLocation(1984) } };
    const b = { type: "V5", value: { asset_id: palletAssetLocation(1984) } };
    expect(getAssetKindKey(a)).toBe(getAssetKindKey(b));
  });

  it("differs for distinct asset kinds", () => {
    expect(getAssetKindKey(usdtAssetKind)).not.toBe(
      getAssetKindKey(v4UsdcAssetKind),
    );
  });
});

describe("getEntryAssetKind", () => {
  it("reads watchEntries args and getEntries keyArgs", () => {
    expect(getEntryAssetKind({ args: [usdtAssetKind] })).toBe(usdtAssetKind);
    expect(getEntryAssetKind({ keyArgs: [dotAssetKind] })).toBe(dotAssetKind);
    expect(getEntryAssetKind({})).toBeNull();
  });
});

describe("formatPayoutAmount", () => {
  it("converts smallest units using asset decimals", () => {
    expect(formatPayoutAmount(20895000000n, 6)).toBe("20895");
    expect(formatPayoutAmount("116667123456", 6)).toBe("116667.123456");
  });

  it("returns null for missing amounts or unknown decimals", () => {
    expect(formatPayoutAmount(undefined, 6)).toBeNull();
    expect(formatPayoutAmount(null, 6)).toBeNull();
    expect(formatPayoutAmount(1000n)).toBeNull();
    expect(formatPayoutAmount(1000n, null)).toBeNull();
  });
});

describe("isPayoutBalanceInsufficient", () => {
  it("compares formatted balances and amounts", () => {
    expect(isPayoutBalanceInsufficient("2538420", "20895")).toBe(false);
    expect(isPayoutBalanceInsufficient("1000", "20895")).toBe(true);
    expect(isPayoutBalanceInsufficient("20895", "20895")).toBe(false);
  });

  it("does not block when a value is unknown", () => {
    expect(isPayoutBalanceInsufficient(null, "20895")).toBe(false);
    expect(isPayoutBalanceInsufficient("1000", null)).toBe(false);
  });
});

describe("getPayoutSpendTitle", () => {
  it("uses post title and falls back to spend index", () => {
    expect(getPayoutSpendTitle({ title: " Spend title " }, 3)).toBe(
      "Spend title",
    );
    expect(getPayoutSpendTitle(null, 3)).toBe("Treasury spend 3");
    expect(getPayoutSpendTitle({}, 3)).toBe("Treasury spend 3");
  });
});

describe("getNextPayoutCountdown", () => {
  const base = {
    orderKey: 100,
    expireAt: 300,
    orderExpirationPeriod: 200,
    latestHeight: 150,
    blockTime: 6000,
  };

  it("counts lease blocks for a mature head", () => {
    const countdown = getNextPayoutCountdown({
      ...base,
      validFrom: 90,
    });
    expect(countdown).toEqual({
      mode: "lease",
      remainingBlocks: 150,
      totalBlocks: 200,
      remainingMs: 900000,
      totalMs: 1200000,
    });
  });

  it("counts maturity blocks for a future-valid head", () => {
    const countdown = getNextPayoutCountdown({
      ...base,
      validFrom: 250,
    });
    expect(countdown).toEqual({
      mode: "maturity",
      remainingBlocks: 100,
      totalBlocks: 150,
      remainingMs: 600000,
      totalMs: 900000,
    });
  });

  it("returns null without latest height or expire block", () => {
    expect(
      getNextPayoutCountdown({
        ...base,
        latestHeight: undefined,
      }),
    ).toBeNull();
    expect(
      getNextPayoutCountdown({
        ...base,
        expireAt: undefined,
      }),
    ).toBeNull();
  });
});

describe("getNextPayoutAction", () => {
  const latestHeight = 1000;

  it("waits while the head is not mature yet", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 1200,
        expireAt: 1400,
        latestHeight,
      }),
    ).toEqual({ kind: "wait", label: "Payout", call: null });
  });

  it("pays a mature head whose order is still alive", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Failed"),
        validFrom: 900,
        expireAt: 1400,
        firstQueuedOrderKey: 950,
        latestHeight,
      }),
    ).toEqual({ kind: "payout", label: "Retry Payment", call: "payout" });
  });

  it("rotates an expired head once another queued spend is mature", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 900,
        expireAt: 999,
        firstQueuedOrderKey: 950,
        latestHeight,
      }),
    ).toEqual({ kind: "rotate", label: "Rotate", call: "checkStatus" });
  });

  it("keeps paying an expired head while no queued spend is mature", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 900,
        expireAt: 999,
        firstQueuedOrderKey: 1001,
        latestHeight,
      }),
    ).toEqual({ kind: "payout", label: "Payout", call: "payout" });
  });

  it("checks status for an attempted head", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Attempted", { id: 1n }),
        latestHeight,
      }),
    ).toEqual({
      kind: "checkStatus",
      label: "Check Status",
      call: "checkStatus",
    });
  });

  it("checks status for a head already past its payout window", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 800,
        expireAt: 999,
        spendExpireAt: 1000,
        firstQueuedOrderKey: 950,
        latestHeight,
      }),
    ).toEqual({ kind: "expire", label: "Check Status", call: "checkStatus" });
  });

  it("offers no transaction while the chain state is unknown", () => {
    expect(
      getNextPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 900,
        expireAt: 1400,
      }),
    ).toEqual({ kind: "wait", label: "Payout", call: null });
  });

  it("returns null without a known status", () => {
    expect(getNextPayoutAction({ status: undefined })).toBeNull();
  });
});

describe("getPayoutAction", () => {
  const latestHeight = 1000;

  it("does not offer a payout for a spend queued behind the head", () => {
    expect(
      getPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 900,
        spendExpireAt: 2000,
        latestHeight,
        isHead: false,
        inOrder: true,
      }),
    ).toEqual({ kind: "queued", label: "Waiting", call: null });
  });

  it("re-admits a live spend missing from the payout order", () => {
    expect(
      getPayoutAction({
        status: spendStatus("Failed"),
        validFrom: 900,
        spendExpireAt: 2000,
        latestHeight,
        isHead: false,
        inOrder: false,
      }),
    ).toEqual({ kind: "requeue", label: "Check Status", call: "checkStatus" });
  });

  it("checks status for an expired queued spend", () => {
    expect(
      getPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 900,
        spendExpireAt: 1000,
        latestHeight,
        isHead: false,
        inOrder: true,
      }),
    ).toEqual({ kind: "expire", label: "Check Status", call: "checkStatus" });
  });

  it("keeps the legacy payout path when the runtime has no payout order", () => {
    expect(
      getPayoutAction({
        status: spendStatus("Pending"),
        validFrom: 900,
        spendExpireAt: 2000,
        latestHeight,
        orderEnabled: false,
      }),
    ).toEqual({ kind: "payout", label: "Payout", call: "payout" });
  });
});

describe("buildPayoutQueue", () => {
  it("builds a queue view model from papi storage values", () => {
    const queue = buildPayoutQueue({
      assetKind: usdtAssetKind,
      nextPayout: [270, 100, 300],
      queue: [
        [268, 101],
        [269, 102],
      ],
      spends: {
        270: {
          amount: 20895000000n,
          valid_from: 90,
          expire_at: 500,
          status: spendStatus("Pending"),
        },
        268: {
          amount: 10000000n,
          valid_from: 95,
          status: spendStatus("Attempted", { id: 1n }),
        },
        269: { amount: 20000000n, valid_from: 95 },
      },
      posts: {
        270: { title: "Spend 270" },
      },
      treasuryBalance: "2538420",
      capacity: 100,
      orderExpirationPeriod: 200,
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queue.symbol).toBe("USDT");
    expect(queue.assetKind).toBe("ForeignAsset #1984");
    expect(queue.capacity).toBe(100);
    expect(queue.treasuryBalance).toBe("2538420");
    expect(queue.nextPayout).toMatchObject({
      index: 270,
      status: "Pending",
      amount: "20895",
      title: "Spend 270",
      validFrom: 90,
      orderKey: 100,
      expireAt: 300,
      spendExpireAt: 500,
      orderExpirationPeriod: 200,
    });
    expect(queue.queue).toEqual([
      {
        index: 268,
        status: "Attempted",
        amount: "10",
        title: "Treasury spend 268",
        orderKey: 101,
        spendExpireAt: undefined,
        expired: false,
      },
      {
        index: 269,
        status: null,
        amount: "20",
        title: "Treasury spend 269",
        orderKey: 102,
        spendExpireAt: undefined,
        expired: false,
      },
    ]);
    expect(queue.toBePaid).toBe("20925");
  });

  it("marks queued spends past their payout window as expired", () => {
    const queue = buildPayoutQueue({
      assetKind: usdtAssetKind,
      nextPayout: [270, 100, 300],
      queue: [
        [268, 101],
        [269, 102],
      ],
      spends: {
        270: {
          amount: 1000000n,
          valid_from: 90,
          expire_at: 500,
          status: spendStatus("Pending"),
        },
        268: {
          amount: 1000000n,
          valid_from: 95,
          expire_at: 990,
          status: spendStatus("Pending"),
        },
        269: {
          amount: 2000000n,
          valid_from: 95,
          expire_at: 2000,
          status: spendStatus("Pending"),
        },
      },
      latestHeight: 1000,
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queue.queue.map((item) => item.expired)).toEqual([true, false]);
    expect(queue.queue[0].spendExpireAt).toBe(990);
    // The expired spend can never be paid, so it is not part of the total.
    expect(queue.toBePaid).toBe("2");
  });

  it("keeps a spend from appearing as both head and queue entry", () => {
    const queue = buildPayoutQueue({
      assetKind: usdtAssetKind,
      nextPayout: [270, 100, 300],
      queue: [[270, 100]],
      spends: {},
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queue.nextPayout.index).toBe(270);
    expect(queue.queue).toEqual([]);
  });

  it("handles a queue without a head or spend data", () => {
    const queue = buildPayoutQueue({
      assetKind: dotAssetKind,
      nextPayout: null,
      queue: [[5, 10]],
      spends: {},
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queue.nextPayout).toBeNull();
    expect(queue.queue).toEqual([
      {
        index: 5,
        status: null,
        amount: null,
        title: "Treasury spend 5",
        orderKey: 10,
        spendExpireAt: undefined,
        expired: false,
      },
    ]);
    expect(queue.toBePaid).toBeNull();
  });
});

describe("buildPayoutQueues", () => {
  const nextPayoutEntries = [
    { args: [usdtAssetKind], value: [270, 100, 300] },
    { args: [dotAssetKind], value: [242, 80, 400] },
  ];
  const payoutQueueEntries = [
    {
      args: [usdtAssetKind],
      value: [
        [268, 101],
        [269, 102],
      ],
    },
  ];

  it("merges next payout and queue entries per asset kind", () => {
    const queues = buildPayoutQueues({
      nextPayoutEntries,
      payoutQueueEntries,
      spends: {
        270: {
          amount: 20895000000n,
          valid_from: 90,
          expire_at: 500,
          status: spendStatus("Pending"),
        },
        268: {
          amount: 10000000n,
          valid_from: 95,
          status: spendStatus("Failed"),
        },
        269: {
          amount: 20000000n,
          valid_from: 95,
          status: spendStatus("Pending"),
        },
        242: {
          amount: 1200000000000n,
          valid_from: 90,
          status: spendStatus("Attempted", { id: 2n }),
        },
      },
      balances: {
        [getAssetKindKey(usdtAssetKind)]: "2538420",
        [getAssetKindKey(dotAssetKind)]: "1876300",
      },
      capacity: 100,
      orderExpirationPeriod: 28800,
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queues).toHaveLength(2);

    const usdt = queues.find((item) => item.symbol === "USDT");
    expect(usdt.id).toBe("USDT");
    expect(usdt.capacity).toBe(100);
    expect(usdt.treasuryBalance).toBe("2538420");
    expect(usdt.nextPayout.index).toBe(270);
    expect(usdt.queue.map((item) => item.index)).toEqual([268, 269]);
    expect(usdt.toBePaid).toBe("20925");

    const dot = queues.find((item) => item.symbol === "DOT");
    expect(dot.assetKind).toBe("Native");
    expect(dot.treasuryBalance).toBe("1876300");
    expect(dot.nextPayout.index).toBe(242);
    expect(dot.nextPayout.orderExpirationPeriod).toBe(28800);
    expect(dot.nextPayout.expireAt).toBe(400);
    expect(dot.toBePaid).toBe("120");
  });

  it("keeps queue ids unique for one asset under two XCM versions", () => {
    const queues = buildPayoutQueues({
      nextPayoutEntries: [
        { args: [v4UsdcAssetKind], value: [10, 100, 200] },
        { args: [v5UsdcAssetKind], value: [11, 100, 200] },
      ],
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queues.map((item) => item.id)).toEqual(["USDC-V4", "USDC-V5"]);
    expect(queues.map((item) => item.label)).toEqual([
      "USDC (V4)",
      "USDC (V5)",
    ]);
  });

  it("skips entries without a value and unknown asset kinds", () => {
    const queues = buildPayoutQueues({
      nextPayoutEntries: [{ args: [undefined], value: [1, 2, 3] }],
      payoutQueueEntries: [{ args: [usdtAssetKind], value: [] }],
      chainSymbol: "DOT",
      chainDecimals: 10,
    });
    expect(queues).toHaveLength(0);
  });
});
