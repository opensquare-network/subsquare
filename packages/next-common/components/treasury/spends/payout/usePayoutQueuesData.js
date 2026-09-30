import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useChainSettings } from "next-common/context/chain";
import { useContextPapi } from "next-common/context/papi";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import { useTreasuryAccountWithPapi } from "next-common/utils/hooks/useTreasuryFreeWithPapi";
import {
  buildPayoutQueues,
  formatPayoutAmount,
  getAssetBalanceQuery,
  getAssetKindKey,
  getBalanceFromStorage,
  getEntryAssetKind,
  getPapiAssetKindInfo,
} from "./chainData";
import useFetchSpendPosts from "./spendPostsContext";

function collectSpendIndexes(nextPayoutEntries, payoutQueueEntries) {
  const indexes = new Set();

  nextPayoutEntries.forEach((entry) => {
    const index = entry?.value?.[0];
    if (!isNil(index)) {
      indexes.add(index);
    }
  });

  payoutQueueEntries.forEach((entry) => {
    (entry?.value ?? []).forEach(([index]) => {
      if (!isNil(index)) {
        indexes.add(index);
      }
    });
  });

  return [...indexes].sort((a, b) => a - b);
}

function collectAssetKinds(nextPayoutEntries, payoutQueueEntries) {
  const kinds = new Map();

  [...nextPayoutEntries, ...payoutQueueEntries].forEach((entry) => {
    const assetKind = getEntryAssetKind(entry);
    if (isNil(assetKind)) {
      return;
    }

    kinds.set(getAssetKindKey(assetKind), assetKind);
  });

  return kinds;
}

function watchEntries(storage, setEntries, setLoading) {
  return storage.watchEntries().subscribe({
    next: ({ entries, deltas }) => {
      // The first emission always carries deltas, later no-op emissions carry null
      if (isNil(deltas)) {
        return;
      }

      setEntries(entries ?? []);
      setLoading(false);
    },
    error: (error) => {
      console.error("Failed to watch treasury payout queue:", error);
      setLoading(false);
    },
  });
}

function getPayoutQueueConstants(api, treasuryPallet) {
  try {
    const constants = api?.constants?.[treasuryPallet];
    return {
      capacity: constants?.MaxQueuedSpends?.() ?? null,
      orderExpirationPeriod: constants?.OrderExpirationPeriod?.() ?? null,
    };
  } catch {
    return { capacity: null, orderExpirationPeriod: null };
  }
}

export default function usePayoutQueuesData() {
  const { api, checkPallet } = useContextPapi();
  const treasuryAccount = useTreasuryAccountWithPapi(api);
  const fetchSpendPosts = useFetchSpendPosts();
  const treasuryPallet = useTreasuryPapiPallet();
  const { symbol: chainSymbol, decimals: chainDecimals } = useChainSettings();

  const [nextPayoutEntries, setNextPayoutEntries] = useState([]);
  const [payoutQueueEntries, setPayoutQueueEntries] = useState([]);
  const [spends, setSpends] = useState({});
  const [balances, setBalances] = useState({});
  const [posts, setPosts] = useState({});
  const [entriesLoading, setEntriesLoading] = useState(true);

  const palletAvailable =
    !!api && !!checkPallet && checkPallet(treasuryPallet, "NextPayout");

  const spendIndexes = useMemo(
    () => collectSpendIndexes(nextPayoutEntries, payoutQueueEntries),
    [nextPayoutEntries, payoutQueueEntries],
  );
  const spendIndexesKey = useMemo(() => spendIndexes.join(","), [spendIndexes]);

  useEffect(() => {
    if (!api || !palletAvailable) {
      return;
    }

    const nextPayoutStorage = api.query?.[treasuryPallet]?.NextPayout;
    const payoutQueueStorage = api.query?.[treasuryPallet]?.PayoutQueue;
    if (!nextPayoutStorage || !payoutQueueStorage) {
      setEntriesLoading(false);
      return;
    }

    setEntriesLoading(true);
    const subscriptions = [
      watchEntries(nextPayoutStorage, setNextPayoutEntries, setEntriesLoading),
      watchEntries(
        payoutQueueStorage,
        setPayoutQueueEntries,
        setEntriesLoading,
      ),
    ];

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [api, treasuryPallet, palletAvailable]);

  useEffect(() => {
    if (!api || !palletAvailable || !spendIndexesKey) {
      return;
    }

    const spendsStorage = api.query?.[treasuryPallet]?.Spends;
    if (!spendsStorage) {
      return;
    }

    const indexes = spendIndexesKey.split(",").map(Number);
    const subscriptions = indexes.map((index) =>
      spendsStorage.watchValue(index).subscribe({
        next: ({ value }) =>
          setSpends((prev) => ({ ...prev, [index]: value ?? null })),
        error: () => {},
      }),
    );

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [api, treasuryPallet, palletAvailable, spendIndexesKey]);

  useEffect(() => {
    if (!api || !palletAvailable || !treasuryAccount) {
      return;
    }

    const subscriptions = [];
    collectAssetKinds(nextPayoutEntries, payoutQueueEntries).forEach(
      (assetKind, key) => {
        const query = getAssetBalanceQuery(assetKind);
        const storage = query && api.query?.[query.pallet]?.Account;
        if (!storage) {
          return;
        }

        const info = getPapiAssetKindInfo(assetKind, {
          chainSymbol,
          chainDecimals,
        });
        try {
          subscriptions.push(
            storage.watchValue(...query.args, treasuryAccount).subscribe({
              next: ({ value }) =>
                setBalances((prev) => ({
                  ...prev,
                  [key]: formatPayoutAmount(
                    getBalanceFromStorage(query.pallet, value),
                    info.decimals,
                  ),
                })),
              error: () => {},
            }),
          );
        } catch (error) {
          console.error("Failed to watch treasury asset balance:", error);
        }
      },
    );

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [
    api,
    treasuryPallet,
    palletAvailable,
    treasuryAccount,
    nextPayoutEntries,
    payoutQueueEntries,
    chainSymbol,
    chainDecimals,
  ]);

  useEffect(() => {
    if (!spendIndexesKey || !fetchSpendPosts) {
      return;
    }

    let cancelled = false;
    const indexes = spendIndexesKey.split(",").map(Number);

    Promise.resolve(fetchSpendPosts(indexes))
      .then((items) => {
        if (cancelled) {
          return;
        }

        const map = {};
        (items ?? []).forEach((item) => {
          if (!isNil(item?.index)) {
            map[item.index] = item;
          }
        });
        setPosts(map);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [spendIndexesKey, fetchSpendPosts]);

  const queues = useMemo(() => {
    const { capacity, orderExpirationPeriod } = getPayoutQueueConstants(
      api,
      treasuryPallet,
    );
    return buildPayoutQueues({
      nextPayoutEntries,
      payoutQueueEntries,
      spends,
      posts,
      balances,
      capacity,
      orderExpirationPeriod,
      chainSymbol,
      chainDecimals,
    });
  }, [
    api,
    treasuryPallet,
    nextPayoutEntries,
    payoutQueueEntries,
    spends,
    posts,
    balances,
    chainSymbol,
    chainDecimals,
  ]);

  return {
    queues,
    // Waits for the api while the chain is connecting; a connected api without
    // the payout queue storage resolves to `available: false` instead.
    loading: !api || (palletAvailable && entriesLoading),
    available: api ? palletAvailable : null,
  };
}
