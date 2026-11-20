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
//
// The order is read at the best block, like the spend itself, so both
// snapshots can not disagree on whether the spend is still the head.
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

  // `key` is the asset kind the stored order belongs to. Until it matches the
  // spend's asset kind the order is still loading, so an order that has not
  // been read yet is never mistaken for one the spend is missing from.
  const [order, setOrder] = useState({
    key: null,
    loading: true,
    head: null,
    queue: [],
    error: false,
  });

  useEffect(() => {
    if (!orderEnabled || isNil(stableAssetKind)) {
      setOrder({
        key: assetKindKey,
        loading: false,
        head: null,
        queue: [],
        error: false,
      });
      return;
    }

    const nextPayoutStorage = api.query?.[treasuryPallet]?.NextPayout;
    const payoutQueueStorage = api.query?.[treasuryPallet]?.PayoutQueue;
    if (!nextPayoutStorage || !payoutQueueStorage) {
      setOrder({
        key: assetKindKey,
        loading: false,
        head: null,
        queue: [],
        error: true,
      });
      return;
    }

    let failed = false;
    let headLoaded = false;
    let queueLoaded = false;
    let head = null;
    let queue = [];

    const publish = () => {
      if (failed || !headLoaded || !queueLoaded) {
        return;
      }
      setOrder({
        key: assetKindKey,
        loading: false,
        head,
        queue,
        error: false,
      });
    };

    // Half an order is unusable, and a later emission of the other storage must
    // not resurrect a snapshot whose other half failed.
    const fail = () => {
      failed = true;
      setOrder({
        key: assetKindKey,
        loading: false,
        head: null,
        queue: [],
        error: true,
      });
    };

    setOrder((prev) => ({ ...prev, loading: true }));

    const subscriptions = [
      nextPayoutStorage.watchValue(stableAssetKind, { at: "best" }).subscribe({
        next: ({ value }) => {
          head = value ?? null;
          headLoaded = true;
          publish();
        },
        error: fail,
      }),
      payoutQueueStorage.watchValue(stableAssetKind, { at: "best" }).subscribe({
        next: ({ value }) => {
          queue = value ?? [];
          queueLoaded = true;
          publish();
        },
        error: fail,
      }),
    ];

    return () =>
      subscriptions.forEach((subscription) => subscription.unsubscribe());
  }, [api, treasuryPallet, orderEnabled, stableAssetKind, assetKindKey]);

  const orderKey = orderEnabled ? assetKindKey : null;
  const orderLoaded = !isNil(orderKey) && order.key === orderKey;
  const orderLoading =
    orderEnabled && (!orderLoaded || (!order.error && order.loading));
  const orderError = orderEnabled && orderLoaded && order.error;

  // Only a fully read order may drive the action
  const ready = orderLoaded && !order.error && !order.loading;
  const head = ready ? order.head : null;
  const queue = ready ? order.queue : [];

  const headIndex = head?.[0];
  const isHead = !isNil(headIndex) && headIndex === index;
  const queueIndex = queue.findIndex(([spendIndex]) => spendIndex === index);
  const inQueue = queueIndex >= 0;

  return {
    orderEnabled,
    orderLoading,
    orderError,
    isHead,
    inQueue,
    inOrder: isHead || inQueue,
    // Tab id of the payout queue of the spend's asset kind, e.g. "USDT-V5"
    queueId,
    // Spends paid before this one reaches the head
    queueAhead: inQueue ? queueIndex + (isNil(headIndex) ? 0 : 1) : 0,
    leaseExpireAt: isHead ? toNumberOrUndefined(head?.[2]) : undefined,
    firstQueuedOrderKey: toNumberOrUndefined(queue[0]?.[1]),
  };
}
