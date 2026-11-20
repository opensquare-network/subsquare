import { useEffect, useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useContextPapi } from "next-common/context/papi";
import { useChain, useIsKintsugi } from "next-common/context/chain";
import Chains from "next-common/utils/consts/chains";
import {
  getAssetBalanceQuery,
  getAssetKindKey,
  getBalanceFromStorage,
  getPayoutAction,
  isPayoutBalanceInsufficient,
} from "next-common/components/treasury/spends/payout/chainData";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import useSpendLatestHeight from "next-common/hooks/treasury/spend/useSpendLatestHeight";
import { useTreasuryAccountWithPapi } from "next-common/utils/hooks/useTreasuryFreeWithPapi";
import useSpendPayoutOrder from "./useSpendPayoutOrder";

// Raw treasury balance of the spend's asset kind, or `null` while unknown.
// `payout` pays from the treasury account, so the pallet rejects an amount
// above it with `PayoutError`.
function useSpendPayoutBalance(assetKind) {
  const { api, checkPallet } = useContextPapi();
  const chain = useChain();
  const isKintsugi = useIsKintsugi();
  const treasuryAccount = useTreasuryAccountWithPapi(api);
  const assetKindKey = isNil(assetKind) ? null : getAssetKindKey(assetKind);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const stableAssetKind = useMemo(() => assetKind, [assetKindKey]);
  const [balance, setBalance] = useState({ key: null, value: null });
  // `useTreasuryAccountWithPapi` reads the Asset Hub treasury account on
  // collectives, and kintsugi/interlay keep the pot in `Tokens`, so on those
  // chains a local balance can not tell whether the payout is affordable.
  const canReadBalance = !isKintsugi && chain !== Chains.collectives;

  useEffect(() => {
    if (!canReadBalance || !api || !treasuryAccount || isNil(stableAssetKind)) {
      return;
    }

    const query = getAssetBalanceQuery(stableAssetKind);
    const storage = query && api.query?.[query.pallet]?.Account;
    if (!query || !storage || !checkPallet(query.pallet, "Account")) {
      return;
    }

    let stale = false;
    const subscription = storage
      .watchValue(...query.args, treasuryAccount)
      .subscribe({
        next: ({ value }) => {
          if (!stale) {
            setBalance({
              key: assetKindKey,
              value: getBalanceFromStorage(query.pallet, value) ?? null,
            });
          }
        },
        error: () => {},
      });

    return () => {
      stale = true;
      subscription.unsubscribe();
    };
  }, [
    canReadBalance,
    api,
    treasuryAccount,
    stableAssetKind,
    assetKindKey,
    checkPallet,
  ]);

  return canReadBalance && balance.key === assetKindKey ? balance.value : null;
}

export default function useSpendPayoutAction(index) {
  const { spend: onchainSpend, loading } = useSubTreasurySpend(index);
  const order = useSpendPayoutOrder(index, onchainSpend);
  const latestHeight = useSpendLatestHeight();
  const treasuryBalance = useSpendPayoutBalance(onchainSpend?.asset_kind);

  const action = useMemo(() => {
    // Without the payout order a spend looks like an orphan, so do not offer
    // any call until it has been read.
    if (!onchainSpend || loading || order.orderLoading || order.orderError) {
      return null;
    }

    return getPayoutAction({
      status: onchainSpend.status,
      validFrom: onchainSpend.valid_from,
      expireAt: order.leaseExpireAt,
      spendExpireAt: onchainSpend.expire_at,
      firstQueuedOrderKey: order.firstQueuedOrderKey,
      latestHeight,
      isHead: order.isHead,
      inOrder: order.inOrder,
      orderEnabled: order.orderEnabled,
    });
  }, [
    onchainSpend,
    loading,
    latestHeight,
    order.orderLoading,
    order.orderError,
    order.leaseExpireAt,
    order.firstQueuedOrderKey,
    order.isHead,
    order.inOrder,
    order.orderEnabled,
  ]);

  const balanceBlocked = useMemo(
    () =>
      !!onchainSpend &&
      action?.kind === "payout" &&
      isPayoutBalanceInsufficient(treasuryBalance, onchainSpend.amount),
    [onchainSpend, action, treasuryBalance],
  );

  return {
    action,
    balanceBlocked,
    loading: loading || order.orderLoading,
    error: order.orderError,
    spendLoading: loading,
    spendExists: !!onchainSpend,
    queueAhead: order.queueAhead,
    isHead: order.isHead,
    inOrder: order.inOrder,
    orderEnabled: order.orderEnabled,
    queueId: order.queueId,
    status: onchainSpend?.status,
    validFrom: onchainSpend?.valid_from,
    spendExpireAt: onchainSpend?.expire_at,
    latestHeight,
  };
}
