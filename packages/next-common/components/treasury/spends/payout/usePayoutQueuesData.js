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
  getAssetMetadataQuery,
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

function watchEntries(storage, setEntries, onError) {
  return storage.watchEntries().subscribe({
    next: ({ entries, deltas }) => {
      // The first emission always carries deltas, later no-op emissions carry null
      if (isNil(deltas)) {
        return;
      }

      setEntries(entries ?? []);
    },
    error: (error) => {
      console.error("Failed to watch treasury payout queue:", error);
      onError();
    },
  });
}

function callConstant(constant) {
  if (typeof constant !== "function") {
    return Promise.resolve(null);
  }

  return Promise.resolve()
    .then(() => constant())
    .catch(() => null);
}

function toNumberOrNull(value) {
  return isNil(value) ? null : Number(value);
}

export default function usePayoutQueuesData(latestHeight) {
  const { api, checkPallet } = useContextPapi();
  const treasuryAccount = useTreasuryAccountWithPapi(api);
  const fetchSpendPosts = useFetchSpendPosts();
  const treasuryPallet = useTreasuryPapiPallet();
  const { symbol: chainSymbol, decimals: chainDecimals } = useChainSettings();

  // `null` means the storage has not emitted yet; `[]` is a known empty value.
  const [nextPayoutEntries, setNextPayoutEntries] = useState(null);
  const [payoutQueueEntries, setPayoutQueueEntries] = useState(null);
  const [spends, setSpends] = useState({});
  const [balances, setBalances] = useState({});
  const [assetMetas, setAssetMetas] = useState({});
  const [posts, setPosts] = useState({});
  const [queueError, setQueueError] = useState(false);
  const [constants, setConstants] = useState({
    capacity: null,
    orderExpirationPeriod: null,
  });

  const palletAvailable =
    !!api &&
    !!checkPallet &&
    checkPallet(treasuryPallet, "NextPayout") &&
    checkPallet(treasuryPallet, "PayoutQueue");

  const nextPayouts = useMemo(
    () => nextPayoutEntries ?? [],
    [nextPayoutEntries],
  );
  const payoutQueues = useMemo(
    () => payoutQueueEntries ?? [],
    [payoutQueueEntries],
  );
  const entriesLoading =
    palletAvailable && (isNil(nextPayoutEntries) || isNil(payoutQueueEntries));

  const spendIndexes = useMemo(
    () => collectSpendIndexes(nextPayouts, payoutQueues),
    [nextPayouts, payoutQueues],
  );
  const spendIndexesKey = useMemo(() => spendIndexes.join(","), [spendIndexes]);

  const assetKinds = useMemo(
    () => collectAssetKinds(nextPayouts, payoutQueues),
    [nextPayouts, payoutQueues],
  );
  const assetKindsKey = useMemo(
    () => [...assetKinds.keys()].sort().join("|"),
    [assetKinds],
  );

  useEffect(() => {
    if (!api || !palletAvailable) {
      return;
    }

    const nextPayoutStorage = api.query?.[treasuryPallet]?.NextPayout;
    const payoutQueueStorage = api.query?.[treasuryPallet]?.PayoutQueue;
    if (!nextPayoutStorage || !payoutQueueStorage) {
      return;
    }

    setNextPayoutEntries(null);
    setPayoutQueueEntries(null);
    // Spend data, balances and metadata are keyed by index/asset kind, so drop
    // the previous chain's values when the API changes.
    setSpends({});
    setBalances({});
    setAssetMetas({});
    setQueueError(false);

    const subscriptions = [
      watchEntries(nextPayoutStorage, setNextPayoutEntries, () =>
        setQueueError(true),
      ),
      watchEntries(payoutQueueStorage, setPayoutQueueEntries, () =>
        setQueueError(true),
      ),
    ];

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [api, treasuryPallet, palletAvailable]);

  // PAPI constants are promises, while the queue capacity and lease period are
  // read synchronously when building the view model.
  useEffect(() => {
    if (!api || !palletAvailable) {
      return;
    }

    let cancelled = false;
    const constantsApi = api.constants?.[treasuryPallet];
    Promise.all([
      callConstant(constantsApi?.MaxQueuedSpends),
      callConstant(constantsApi?.OrderExpirationPeriod),
    ]).then(([capacity, orderExpirationPeriod]) => {
      if (cancelled) {
        return;
      }

      setConstants({
        capacity: toNumberOrNull(capacity),
        orderExpirationPeriod: toNumberOrNull(orderExpirationPeriod),
      });
    });

    return () => {
      cancelled = true;
    };
  }, [api, treasuryPallet, palletAvailable]);

  useEffect(() => {
    if (!api || !palletAvailable || !spendIndexesKey) {
      return;
    }

    const spendsStorage = api.query?.[treasuryPallet]?.Spends;
    if (!checkPallet(treasuryPallet, "Spends")) {
      return;
    }

    const indexes = spendIndexesKey.split(",").map(Number);
    const subscriptions = indexes.map((index) => {
      try {
        return spendsStorage.watchValue(index).subscribe({
          next: ({ value }) =>
            setSpends((prev) => ({ ...prev, [index]: value ?? null })),
          error: () => {},
        });
      } catch (error) {
        console.error("Failed to watch treasury spend:", error);
        return null;
      }
    });

    return () =>
      subscriptions.forEach((subscription) => subscription?.unsubscribe());
  }, [api, treasuryPallet, palletAvailable, checkPallet, spendIndexesKey]);

  useEffect(() => {
    if (!api || !palletAvailable || !treasuryAccount) {
      return;
    }

    const subscriptions = [];
    assetKinds.forEach((assetKind, key) => {
      const query = getAssetBalanceQuery(assetKind);
      if (!query || !checkPallet(query.pallet, "Account")) {
        return;
      }

      const storage = api.query?.[query.pallet]?.Account;
      const info = getPapiAssetKindInfo(assetKind, {
        chainSymbol,
        chainDecimals,
      });
      const decimals = isNil(assetMetas[key]?.decimals)
        ? info.decimals
        : assetMetas[key].decimals;
      try {
        subscriptions.push(
          storage.watchValue(...query.args, treasuryAccount).subscribe({
            next: ({ value }) =>
              setBalances((prev) => ({
                ...prev,
                [key]: formatPayoutAmount(
                  getBalanceFromStorage(query.pallet, value),
                  decimals,
                ),
              })),
            error: () => {},
          }),
        );
      } catch (error) {
        console.error("Failed to watch treasury asset balance:", error);
      }
    });

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [
    api,
    treasuryPallet,
    palletAvailable,
    treasuryAccount,
    checkPallet,
    assetKinds,
    assetMetas,
    chainSymbol,
    chainDecimals,
  ]);

  // Asset decimals are not part of the asset kind; non-native assets can use
  // any precision, so read it from the assets pallet metadata.
  useEffect(() => {
    if (!api || !palletAvailable || !assetKindsKey) {
      return;
    }

    let cancelled = false;
    assetKinds.forEach((assetKind, key) => {
      const query = getAssetMetadataQuery(assetKind);
      if (!query || !checkPallet(query.pallet, "Metadata")) {
        return;
      }

      const storage = api.query?.[query.pallet]?.Metadata;
      Promise.resolve()
        .then(() => storage.getValue(...query.args))
        .then((metadata) => {
          if (cancelled || isNil(metadata?.decimals)) {
            return;
          }

          setAssetMetas((prev) => ({
            ...prev,
            [key]: { decimals: Number(metadata.decimals) },
          }));
        })
        .catch(() => {});
    });

    return () => {
      cancelled = true;
    };
  }, [api, palletAvailable, checkPallet, assetKinds, assetKindsKey]);

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

  const queues = useMemo(
    () =>
      buildPayoutQueues({
        nextPayoutEntries: nextPayouts,
        payoutQueueEntries: payoutQueues,
        spends,
        posts,
        balances,
        assetMetas,
        capacity: constants.capacity,
        orderExpirationPeriod: constants.orderExpirationPeriod,
        latestHeight,
        chainSymbol,
        chainDecimals,
      }),
    [
      nextPayouts,
      payoutQueues,
      spends,
      posts,
      balances,
      assetMetas,
      constants,
      latestHeight,
      chainSymbol,
      chainDecimals,
    ],
  );

  return {
    queues,
    // Waits for the api while the chain is connecting; a connected api without
    // the payout queue storage resolves to `available: false` instead.
    loading: !api || (palletAvailable && entriesLoading),
    available: api ? palletAvailable : null,
    error: queueError,
    ready: palletAvailable && !entriesLoading && !queueError,
  };
}
