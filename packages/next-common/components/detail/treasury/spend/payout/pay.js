import { useMemo, useState } from "react";
import { useRouter } from "next/router";
import { ArrowExternalLink } from "@osn/icons/subsquare";
import { useOnchainData, usePostState } from "next-common/context/post";
import dynamicPopup from "next-common/lib/dynamic/popup";
import SplitButton from "next-common/lib/button/splitButton";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import { useChainSettings } from "next-common/context/chain";
import {
  getPayoutAction,
  getPayoutActionHint,
  getPayoutActionLabel,
} from "next-common/components/treasury/spends/payout/chainData";
import useSpendLatestHeight from "next-common/hooks/treasury/spend/useSpendLatestHeight";
import useSpendPayoutOrder from "./useSpendPayoutOrder";

const Popup = dynamicPopup(() => import("./popup"));

// The button always names the payout action; why it is not clickable is
// explained by the tooltip instead of the label
function getActionLabel(action, status) {
  if (action?.call) {
    return action.label;
  }

  return getPayoutActionLabel(status) ?? "Payout";
}

function useSpendPayoutAction(index) {
  const { spend: onchainSpend, loading } = useSubTreasurySpend(index);
  const order = useSpendPayoutOrder(index, onchainSpend);
  const latestHeight = useSpendLatestHeight();

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

  return {
    action,
    loading: loading || order.orderLoading,
    error: order.orderError,
    queueAhead: order.queueAhead,
    isHead: order.isHead,
    inOrder: order.inOrder,
    orderEnabled: order.orderEnabled,
    queueId: order.queueId,
    status: onchainSpend?.status,
    validFrom: onchainSpend?.valid_from,
    latestHeight,
  };
}

function PayoutContent({
  action,
  loading,
  error,
  queueAhead,
  isHead,
  inOrder,
  orderEnabled,
  queueId,
  status,
  validFrom,
  latestHeight,
  onOpen,
}) {
  const router = useRouter();
  const { blockTime } = useChainSettings();
  const hint = getPayoutActionHint({
    action,
    loading,
    error,
    isHead,
    inOrder,
    queueAhead,
    validFrom,
    latestHeight,
    blockTime,
  });
  const label = getActionLabel(action, status);
  const disabled = loading || !action?.call;
  // The queue page is only meaningful on runtimes that have the payout order
  const queueUrl =
    orderEnabled && queueId
      ? {
          pathname: "/treasury/spends/queues",
          query: { queue: queueId.toLowerCase() },
        }
      : null;

  return (
    <div className="flex flex-col gap-2">
      <SplitButton
        fullWidth
        loading={loading}
        disabled={disabled}
        mainTooltip={hint}
        onClick={onOpen}
        rightIcon={
          queueUrl ? <ArrowExternalLink width={24} height={24} /> : undefined
        }
        rightLabel="View payout queue"
        // The queue can be browsed while the payout itself is not payable
        rightDisabled={false}
        onRightClick={queueUrl ? () => router.push(queueUrl) : undefined}
      >
        {label}
      </SplitButton>
      {!!hint && !!action?.call && (
        <p className="text12Medium text-textTertiary">{hint}</p>
      )}
    </div>
  );
}

export default function TreasurySpendPay() {
  // Freeze the action confirmed by the user: chain state can change while the
  // popup is open and the signed call must be the one that was shown.
  const [openedAction, setOpenedAction] = useState(null);
  const { index } = useOnchainData() || {};
  const state = usePostState();
  const payout = useSpendPayoutAction(index);

  // The indexer marks a spend `Paid` as soon as the payout is submitted, while
  // on chain it is still `Attempted` (needs `check_status`) or `Failed` (can be
  // retried). Only `Processed` means it is gone from chain storage.
  if (state === "Processed" || (state === "Paid" && !payout.action?.call)) {
    return null;
  }

  const call = payout.action?.call;
  const title = getActionLabel(payout.action, payout.status);

  return (
    <>
      <PayoutContent
        {...payout}
        onOpen={() => setOpenedAction({ call, title })}
      />
      {!!openedAction && (
        <Popup
          call={openedAction.call}
          title={openedAction.title}
          onClose={() => setOpenedAction(null)}
        />
      )}
    </>
  );
}
