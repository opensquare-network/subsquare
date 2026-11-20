import BigNumber from "bignumber.js";
import { useEffect, useMemo, useState } from "react";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import { useChainSettings } from "next-common/context/chain";
import useAssetBalance from "next-common/hooks/treasury/useAssetBalance";
import { getAssetInfoFromAssetKind } from "next-common/utils/treasury/multiAssetBounty/assetKind";
import { getMultiAssetBountyAmounts } from "next-common/utils/treasury/multiAssetBounty/amounts";

// Funds that reached the bounty account but are not registered in the recorded
// value yet. `increase_value` is the only way to register them: award and close
// only move the recorded amount and whatever is left on the account when the
// bounty leaves storage cannot be moved by any pallet call.
//
// The pallet counts `value - ChildBountiesValuePerParent` as available for
// child bounties, so anything held above that is unregistered. All the numbers
// are read from one block so they cannot drift apart like the indexed data can.
export default function useMultiAssetBountyValueState() {
  const api = useContextApi();
  const {
    address,
    assetKind,
    value: indexedValue,
    bountyIndex,
  } = useOnchainData();
  const { decimals: chainDecimals, symbol: chainSymbol } = useChainSettings();
  const assetInfo = useMemo(
    () => getAssetInfoFromAssetKind(assetKind, chainDecimals, chainSymbol),
    [assetKind, chainDecimals, chainSymbol],
  );
  const { balance, loading: balanceLoading } = useAssetBalance(
    address,
    assetInfo,
  );

  const [chainState, setChainState] = useState(null);
  const [chainStateLoading, setChainStateLoading] = useState(true);
  const [chainStateError, setChainStateError] = useState(null);

  useEffect(() => {
    setChainState(null);
    setChainStateError(null);
    setChainStateLoading(true);

    if (bountyIndex == null) {
      setChainStateError(new Error("The bounty index is unavailable"));
      setChainStateLoading(false);
      return;
    }
    // The api connects after mount; keep loading and retry when it arrives.
    if (!api) {
      return;
    }
    const query = api.query?.multiAssetBounties;
    if (!query?.bounties) {
      setChainStateError(
        new Error("The chain does not expose MultiAssetBounties"),
      );
      setChainStateLoading(false);
      return;
    }

    let cancelled = false;
    Promise.all([
      query.bounties(bountyIndex),
      query.childBountiesValuePerParent
        ? query.childBountiesValuePerParent(bountyIndex)
        : null,
      query.curatorDeposit ? query.curatorDeposit(bountyIndex, null) : null,
      query.childBounties ? query.childBounties.entries(bountyIndex) : [],
    ])
      .then(([bounty, childValue, deposit, childEntries]) => {
        if (cancelled) {
          return;
        }

        const onchainBounty = bounty?.isSome ? bounty.unwrap() : null;
        if (!onchainBounty) {
          setChainStateError(
            new Error("Multi-asset bounty is no longer available on-chain"),
          );
          return;
        }

        setChainState({
          value: onchainBounty?.value?.toString() ?? null,
          childBountiesValue: new BigNumber(childValue?.toString() ?? 0),
          curatorDeposit:
            deposit?.isSome === true
              ? new BigNumber(deposit.unwrap().toString())
              : null,
          // A refunded child keeps its value in ChildBountiesValuePerParent
          // until check_status drops it, while the refunded funds are already
          // back on the parent account. The unregistered amount computed from
          // that snapshot would be overstated by the refunded value, so the
          // caller asks the user to run Check Status on that child first.
          refundPending: (childEntries ?? []).some(
            ([, child]) =>
              child?.isSome === true &&
              child.unwrap().status?.isRefundAttempted === true,
          ),
        });
      })
      .catch((error) => {
        console.error("Failed to load multi-asset bounty state", error);
        if (!cancelled) {
          setChainStateError(error);
        }
      })
      .finally(() => {
        if (!cancelled) {
          setChainStateLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [api, bountyIndex]);

  const computed = useMemo(() => {
    if (!chainState) {
      return null;
    }

    return {
      ...getMultiAssetBountyAmounts({
        value: chainState.value ?? indexedValue,
        childBountiesValue: chainState.childBountiesValue,
        balance,
        refundPending: chainState.refundPending,
      }),
      curatorDeposit: chainState.curatorDeposit,
      refundPending: chainState.refundPending,
    };
  }, [chainState, indexedValue, balance]);

  return {
    assetInfo,
    ...computed,
    error: chainStateError,
    loading: balanceLoading || chainStateLoading,
  };
}
