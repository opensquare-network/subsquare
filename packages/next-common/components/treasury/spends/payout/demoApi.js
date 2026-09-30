import {
  DEMO_BALANCES,
  DEMO_BLOCK_INTERVAL_MS,
  DEMO_HEIGHT,
  DEMO_MAX_QUEUED_SPENDS,
  DEMO_NEXT_PAYOUTS,
  DEMO_ORDER_EXPIRATION_PERIOD,
  DEMO_PAYOUT_QUEUES,
  DEMO_POSTS,
  DEMO_SPENDS,
} from "./demoData";

const TREASURY_PALLET_ID = "0x70792f7472737279";

function mockBlock(number) {
  return {
    hash: `0x${number.toString(16).padStart(64, "0")}`,
    number,
    parent: `0x${(number - 1).toString(16).padStart(64, "0")}`,
  };
}

export function createMockObservable({
  getPayload,
  getNoopPayload,
  emitIntervalMs = DEMO_BLOCK_INTERVAL_MS,
}) {
  return {
    subscribe(observerOrNext) {
      const observer =
        typeof observerOrNext === "function"
          ? { next: observerOrNext }
          : observerOrNext;
      let blockNumber = DEMO_HEIGHT;
      observer?.next?.({ block: mockBlock(blockNumber), ...getPayload() });

      let timer = null;
      if (getNoopPayload && emitIntervalMs > 0) {
        timer = setInterval(() => {
          blockNumber++;
          observer?.next?.({
            block: mockBlock(blockNumber),
            ...getNoopPayload(),
          });
        }, emitIntervalMs);
      }

      return {
        unsubscribe() {
          if (timer) {
            clearInterval(timer);
          }
        },
      };
    },
  };
}

function createEntriesObservable(entries, emitIntervalMs) {
  return createMockObservable({
    emitIntervalMs,
    getPayload: () => ({
      entries,
      deltas: { deleted: [], upserted: entries },
    }),
    getNoopPayload: () => ({ entries, deltas: null }),
  });
}

export function createDemoPapiApi({ emitIntervalMs } = {}) {
  const watchEntries = (entries) => ({
    watchEntries: () => createEntriesObservable(entries, emitIntervalMs),
  });

  return {
    constants: {
      Treasury: {
        MaxQueuedSpends: () => DEMO_MAX_QUEUED_SPENDS,
        OrderExpirationPeriod: () => DEMO_ORDER_EXPIRATION_PERIOD,
        PalletId: () => TREASURY_PALLET_ID,
      },
    },
    query: {
      Treasury: {
        NextPayout: watchEntries(DEMO_NEXT_PAYOUTS),
        PayoutQueue: watchEntries(DEMO_PAYOUT_QUEUES),
        Spends: {
          watchValue: (index) =>
            createMockObservable({
              emitIntervalMs,
              getPayload: () => ({ value: DEMO_SPENDS[index] }),
            }),
        },
      },
      System: {
        Account: {
          watchValue: () =>
            createMockObservable({
              emitIntervalMs,
              getPayload: () => ({
                value: { data: { free: DEMO_BALANCES.native } },
              }),
            }),
        },
      },
      Assets: {
        Account: {
          watchValue: (assetId) =>
            createMockObservable({
              emitIntervalMs,
              getPayload: () => ({
                value: { balance: DEMO_BALANCES[assetId] },
              }),
            }),
        },
      },
    },
  };
}

export function createDemoFetchSpendPosts() {
  return async (indexes = []) =>
    indexes.map((index) => DEMO_POSTS[index]).filter(Boolean);
}
