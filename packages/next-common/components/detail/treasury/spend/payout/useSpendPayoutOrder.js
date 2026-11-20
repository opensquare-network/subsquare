import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useContextPapi } from "next-common/context/papi";
import { useTreasuryPapiPallet } from "next-common/context/treasury";
import { useChainSettings } from "next-common/context/chain";
import {
  getAssetKindKey,
  getPayoutQueueId,
} from "next-common/components/treasury/spends/payout/chainData";

function toNumberOrUndefined(value) {
  return isNil(value) ? undefined : Number(value);
}

// Reads the payout order of a single spend: whether it is the `NextPayout`
// head for its asset kind, whether it is queued behind it (and how many spends
// are ahead), or whether it is not part of the order at all.
export default function useSpendPayoutOrder(index, onchainSpend) {
  const { api, checkPallet } = useContextPapi();
  const treasuryPallet = useTreasuryPapiPallet();
  const { symbol: chainSymbol, decimals: chainDecimals } = useChainSettings();
  const orderEnabled =
    !!api &&
    checkPallet(treasuryPallet, "NextPayout") &&
    checkPallet(treasuryPallet, "PayoutQueue");

  const assetKind = onchainSpend?.asset_kind;
  const assetKindKey = isNil(assetKind) ? null : getAssetKindKey(assetKind);
  const queueId = isNil(assetKind)
    ? null
    : getPayoutQueueId(assetKind, { chainSymbol, chainDecimals });
  // The decoded spend is a new object on every block; keep the subscription
  // keyed by the asset kind value instead of its object identity.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableAssetKind = useMemo(() => assetKind, [assetKindKey]);

  const [order, setOrder] = useState({
    loading: true,
    head: null,
    queue: [],
    error: false,
  });

  useEffect(() => {
    if (!orderEnabled || isNil(stableAssetKind)) {
      setOrder({ loading: false, head: null, queue: [], error: false });
      return;
    }

    const nextPayoutStorage = api.query?.[treasuryPallet]?.NextPayout;
    const payoutQueueStorage = api.query?.[treasuryPallet]?.PayoutQueue;
    if (!nextPayoutStorage || !payoutQueueStorage) {
      setOrder({ loading: false, head: null, queue: [], error: true });
      return;
    }

    let headLoaded = false;
    let queueLoaded = false;
    let head = null;
    let queue = [];

    const publish = () => {
      if (!headLoaded || !queueLoaded) {
        return;
      }
      setOrder({ loading: false, head, queue, error: false });
    };

    setOrder((prev) => ({ ...prev, loading: true }));

    const subscriptions = [
      nextPayoutStorage.watchValue(stableAssetKind).subscribe({
        next: ({ value }) => {
          head = value ?? null;
          headLoaded = true;
          publish();
        },
        error: () =>
          setOrder((prev) => ({ ...prev, loading: false, error: true })),
      }),
      payoutQueueStorage.watchValue(stableAssetKind).subscribe({
        next: ({ value }) => {
          queue = value ?? [];
          queueLoaded = true;
          publish();
        },
        error: () =>
          setOrder((prev) => ({ ...prev, loading: false, error: true })),
      }),
    ];

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [api, treasuryPallet, orderEnabled, stableAssetKind]);

  const headIndex = order.head?.[0];
  const isHead = !isNil(headIndex) && headIndex === index;
  const queueIndex = (order.queue ?? []).findIndex(
    ([spendIndex]) => spendIndex === index,
  );
  const inQueue = queueIndex >= 0;
  const inOrder = isHead || inQueue;

  return {
    orderEnabled,
    orderLoading: order.loading,
    orderError: order.error,
    isHead,
    inQueue,
    inOrder,
    // Tab id of the payout queue of the spend's asset kind, e.g. "USDT-V5"
    queueId,
    // Spends paid before this one reaches the head
    queueAhead: inQueue
      ? queueIndex + (isNil(headIndex) || order.loading ? 0 : 1)
      : 0,
    leaseExpireAt: isHead ? toNumberOrUndefined(order.head?.[2]) : undefined,
    firstQueuedOrderKey: toNumberOrUndefined(order.queue?.[0]?.[1]),
  };
}
