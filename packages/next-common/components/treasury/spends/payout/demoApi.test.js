import { describe, expect, it, vi } from "vitest";
import { createCheckPallet } from "next-common/utils/papi/checkPallet";
import {
  buildPayoutQueues,
  formatPayoutAmount,
  getAssetBalanceQuery,
  getAssetKindKey,
  getBalanceFromStorage,
  getEntryAssetKind,
  getNextPayoutCountdown,
  getPapiAssetKindInfo,
} from "./chainData";
import { createDemoFetchSpendPosts, createDemoPapiApi } from "./demoApi";
import {
  DEMO_BALANCES,
  DEMO_BLOCK_INTERVAL_MS,
  DEMO_HEIGHT,
  DEMO_MAX_QUEUED_SPENDS,
  DEMO_ORDER_EXPIRATION_PERIOD,
  DEMO_PALLETS,
} from "./demoData";

function collectFirst(observable) {
  let payload;
  const subscription = observable.subscribe((value) => {
    payload = value;
  });
  subscription.unsubscribe();
  return payload;
}

describe("createDemoPapiApi", () => {
  it("exposes mock treasury constants", () => {
    const api = createDemoPapiApi({ emitIntervalMs: 0 });
    expect(api.constants.Treasury.MaxQueuedSpends()).toBe(
      DEMO_MAX_QUEUED_SPENDS,
    );
    expect(api.constants.Treasury.OrderExpirationPeriod()).toBe(
      DEMO_ORDER_EXPIRATION_PERIOD,
    );
    expect(api.constants.Treasury.PalletId()).toBe("0x70792f7472737279");
  });

  it("emits mock next payout entries with initial deltas", () => {
    const api = createDemoPapiApi({ emitIntervalMs: 0 });
    const { entries, deltas, block } = collectFirst(
      api.query.Treasury.NextPayout.watchEntries(),
    );

    expect(entries).toHaveLength(3);
    expect(deltas).toEqual({ deleted: [], upserted: entries });
    expect(block).toEqual({
      hash: `0x${DEMO_HEIGHT.toString(16).padStart(64, "0")}`,
      number: DEMO_HEIGHT,
      parent: `0x${(DEMO_HEIGHT - 1).toString(16).padStart(64, "0")}`,
    });

    const usdtKind = getEntryAssetKind(entries[0]);
    expect(
      getPapiAssetKindInfo(usdtKind, { chainSymbol: "DOT", chainDecimals: 10 })
        .symbol,
    ).toBe("USDT");
    // 1d 4h 23min of 6s blocks after the demo height
    expect(entries[0].value).toEqual([
      270,
      DEMO_HEIGHT - 11770,
      DEMO_HEIGHT + 17030,
    ]);
    expect(entries[1].value).toEqual([
      271,
      DEMO_HEIGHT - 25080,
      DEMO_HEIGHT + 3720,
    ]);
  });

  it("emits null deltas on later emissions and stops on unsubscribe", () => {
    vi.useFakeTimers();
    try {
      const api = createDemoPapiApi();
      const emissions = [];
      const subscription =
        api.query.Treasury.PayoutQueue.watchEntries().subscribe((value) =>
          emissions.push(value),
        );

      vi.advanceTimersByTime(2.5 * DEMO_BLOCK_INTERVAL_MS);
      expect(emissions).toHaveLength(3);
      expect(emissions[1].entries).toEqual(emissions[0].entries);
      expect(emissions[1].deltas).toBeNull();
      expect(emissions.map(({ block }) => block.number)).toEqual([
        DEMO_HEIGHT,
        DEMO_HEIGHT + 1,
        DEMO_HEIGHT + 2,
      ]);

      subscription.unsubscribe();
      vi.advanceTimersByTime(3 * DEMO_BLOCK_INTERVAL_MS);
      expect(emissions).toHaveLength(3);
    } finally {
      vi.useRealTimers();
    }
  });

  it("emits mock spends and balances", () => {
    const api = createDemoPapiApi({ emitIntervalMs: 0 });

    const spendResult = collectFirst(api.query.Treasury.Spends.watchValue(270));
    expect(spendResult.block.number).toBe(DEMO_HEIGHT);
    const spend = spendResult.value;
    expect(spend.amount).toBe(20895000000n);
    expect(spend.valid_from).toBe(DEMO_HEIGHT - 20000);
    expect(spend.status).toStrictEqual({ type: "Pending", value: undefined });
    expect(
      collectFirst(api.query.Treasury.Spends.watchValue(999)).value,
    ).toBeUndefined();

    expect(
      collectFirst(api.query.System.Account.watchValue("account")).value,
    ).toEqual({ data: { free: DEMO_BALANCES.native } });
    expect(
      collectFirst(api.query.Assets.Account.watchValue(1984, "account")).value,
    ).toEqual({ balance: DEMO_BALANCES[1984] });
  });
});

describe("createCheckPallet", () => {
  const checkPallet = createCheckPallet(DEMO_PALLETS);

  it("finds demo pallets and storage items", () => {
    expect(checkPallet("Treasury", "NextPayout")).toBe(true);
    expect(checkPallet("Treasury", "PayoutQueue")).toBe(true);
    expect(checkPallet("System", "Account")).toBe(true);
    expect(checkPallet("Treasury", "Proposals")).toBe(false);
    expect(checkPallet("Missing")).toBe(false);
    expect(checkPallet()).toBe(false);
  });
});

describe("createDemoFetchSpendPosts", () => {
  it("returns demo posts for known indexes", async () => {
    const posts = await createDemoFetchSpendPosts()([270, 999]);
    expect(posts).toHaveLength(1);
    expect(posts[0].index).toBe(270);
    expect(posts[0].title).toContain("Subscan Enterprise Explorer License");
  });
});

// Mirrors what usePayoutQueuesData does with the demo mock api, so the mock
// chain data and the chain pipeline stay consistent.
function readDemoQueueData() {
  const api = createDemoPapiApi({ emitIntervalMs: 0 });
  const nextPayoutEntries = collectFirst(
    api.query.Treasury.NextPayout.watchEntries(),
  ).entries;
  const payoutQueueEntries = collectFirst(
    api.query.Treasury.PayoutQueue.watchEntries(),
  ).entries;

  const spendIndexes = new Set();
  nextPayoutEntries.forEach((entry) => spendIndexes.add(entry.value[0]));
  payoutQueueEntries.forEach((entry) =>
    entry.value.forEach(([index]) => spendIndexes.add(index)),
  );

  const spends = {};
  [...spendIndexes].forEach((index) => {
    spends[index] = collectFirst(
      api.query.Treasury.Spends.watchValue(index),
    ).value;
  });

  const balances = {};
  const assetKinds = new Map();
  [...nextPayoutEntries, ...payoutQueueEntries].forEach((entry) => {
    const assetKind = getEntryAssetKind(entry);
    assetKinds.set(getAssetKindKey(assetKind), assetKind);
  });
  assetKinds.forEach((assetKind, key) => {
    const query = getAssetBalanceQuery(assetKind);
    const observable =
      query.pallet === "System"
        ? api.query.System.Account.watchValue("account")
        : api.query.Assets.Account.watchValue(...query.args, "account");
    const info = getPapiAssetKindInfo(assetKind, {
      chainSymbol: "DOT",
      chainDecimals: 10,
    });
    balances[key] = formatPayoutAmount(
      getBalanceFromStorage(query.pallet, collectFirst(observable).value),
      info.decimals,
    );
  });

  return { api, nextPayoutEntries, payoutQueueEntries, spends, balances };
}

describe("demo mock data through the payout queue pipeline", () => {
  it("keeps each asset queue sorted, distinct and backed by its spends", () => {
    const { nextPayoutEntries, payoutQueueEntries, spends } =
      readDemoQueueData();
    const heads = new Map(
      nextPayoutEntries.map(({ args, value }) => [
        getAssetKindKey(args[0]),
        value,
      ]),
    );
    const seenIndexes = new Set();

    for (const { args, value: waiting } of payoutQueueEntries) {
      const [headIndex, headOrderKey, leaseExpiry] = heads.get(
        getAssetKindKey(args[0]),
      );
      expect(spends[headIndex]?.asset_kind).toEqual(args[0]);
      expect(leaseExpiry).toBe(headOrderKey + DEMO_ORDER_EXPIRATION_PERIOD);
      expect(seenIndexes.has(headIndex)).toBe(false);
      seenIndexes.add(headIndex);

      let previousOrderKey = headOrderKey;
      for (const [index, orderKey] of waiting) {
        expect(spends[index]?.asset_kind).toEqual(args[0]);
        expect(orderKey).toBeGreaterThanOrEqual(previousOrderKey);
        expect(orderKey).toBeGreaterThanOrEqual(spends[index].valid_from);
        expect(spends[index].expire_at).toBeGreaterThan(DEMO_HEIGHT);
        expect(seenIndexes.has(index)).toBe(false);
        seenIndexes.add(index);
        previousOrderKey = orderKey;
      }
    }
  });

  it("builds the demo queues through the same chain pipeline", async () => {
    const { api, nextPayoutEntries, payoutQueueEntries, spends, balances } =
      readDemoQueueData();

    const postsList = await createDemoFetchSpendPosts()([270, 242]);
    const posts = Object.fromEntries(
      postsList.map((post) => [post.index, post]),
    );

    const queues = buildPayoutQueues({
      nextPayoutEntries,
      payoutQueueEntries,
      spends,
      posts,
      balances,
      capacity: api.constants.Treasury.MaxQueuedSpends(),
      orderExpirationPeriod: api.constants.Treasury.OrderExpirationPeriod(),
      chainSymbol: "DOT",
      chainDecimals: 10,
    });

    expect(queues.map((queue) => queue.symbol)).toEqual([
      "USDT",
      "USDC",
      "DOT",
    ]);

    const usdt = queues.find((queue) => queue.symbol === "USDT");
    expect(usdt.assetKind).toBe("ForeignAsset #1984");
    expect(usdt.capacity).toBe(100);
    expect(usdt.treasuryBalance).toBe("2538420");
    expect(usdt.nextPayout).toMatchObject({
      index: 270,
      status: "Pending",
      amount: "20895",
      validFrom: DEMO_HEIGHT - 20000,
      orderKey: DEMO_HEIGHT - 11770,
      expireAt: DEMO_HEIGHT + 17030,
      orderExpirationPeriod: 28800,
    });
    expect(usdt.nextPayout.title).toContain(
      "Subscan Enterprise Explorer License",
    );
    expect(usdt.queue).toHaveLength(11);
    expect(usdt.queue.map((item) => item.index)).toEqual([
      268, 269, 237, 238, 239, 240, 255, 256, 257, 263, 265,
    ]);
    expect(usdt.toBePaid).toBe("162396");

    const usdtCountdown = getNextPayoutCountdown({
      ...usdt.nextPayout,
      latestHeight: DEMO_HEIGHT,
      blockTime: 6000,
    });
    expect(usdtCountdown).toMatchObject({
      mode: "lease",
      remainingBlocks: 17030,
      totalBlocks: 28800,
    });

    const usdc = queues.find((queue) => queue.symbol === "USDC");
    expect(usdc.nextPayout.status).toBe("Failed");
    expect(usdc.treasuryBalance).toBe("1204750");
    expect(usdc.toBePaid).toBe("567477");

    const dot = queues.find((queue) => queue.symbol === "DOT");
    expect(dot.assetKind).toBe("Native");
    expect(dot.treasuryBalance).toBe("1876300");
    expect(dot.nextPayout.status).toBe("Attempted");
    expect(dot.toBePaid).toBe("27200");
    expect(
      getNextPayoutCountdown({
        ...dot.nextPayout,
        latestHeight: DEMO_HEIGHT,
        blockTime: 6000,
      }),
    ).toMatchObject({ mode: "lease", remainingBlocks: 27600 });
  });

  it("models a payable Attempted head with the LocalPay payment id", () => {
    const { nextPayoutEntries, spends } = readDemoQueueData();
    const dot = nextPayoutEntries.find((entry) => entry.value[0] === 242);
    const spend = spends[242];

    expect(dot.args[0].value.asset_id.parents).toBe(1);
    expect(dot.value[1]).toBeLessThanOrEqual(DEMO_HEIGHT);
    expect(spend.valid_from).toBeLessThanOrEqual(DEMO_HEIGHT);
    expect(spend.expire_at).toBe(DEMO_HEIGHT - 600 + 30 * 14400);
    expect(spend.status).toStrictEqual({
      type: "Attempted",
      value: { id: (1n << 64n) - 1n },
    });
    expect(spend.beneficiary.value).toMatchObject({
      location: { parents: 0 },
      account_id: { parents: 0 },
    });
    expect(spend.beneficiary.value.account_id.interior.value).toStrictEqual({
      type: "AccountId32",
      value: { network: undefined, id: `0x${"00".repeat(32)}` },
    });
  });
});
