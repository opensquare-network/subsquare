import { useMemo, useState } from "react";
import { isNil } from "lodash-es";
import { useOnchainData, usePostState } from "next-common/context/post";
import PrimaryButton from "next-common/lib/button/primary";
import dynamicPopup from "next-common/lib/dynamic/popup";
import useSubTreasurySpend from "next-common/hooks/treasury/spend/useSubTreasurySpend";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";
import Tooltip from "next-common/components/tooltip";
import { getPayoutAction } from "next-common/components/treasury/spends/payout/chainData";
import useSpendPayoutOrder from "./useSpendPayoutOrder";

const Popup = dynamicPopup(() => import("./popup"));

const ACTION_TITLES = {
  payout: "Payout",
  checkStatus: "Check Status",
  rotate: "Rotate Payout Order",
  expire: "Check Status",
  requeue: "Check Status",
};

function useSpendPayoutAction(index) {
  const { spend: onchainSpend, loading } = useSubTreasurySpend(index);
  const order = useSpendPayoutOrder(index, onchainSpend);
  const latestHeight = useAhmLatestHeight();

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
    validFrom: onchainSpend?.valid_from,
    latestHeight,
  };
}

function getHint({
  action,
  loading,
  error,
  queueAhead,
  validFrom,
  latestHeight,
}) {
  if (loading) {
    return null;
  }

  if (error) {
    return "Failed to read the payout order from the chain.";
  }

  if (!action) {
    return "Can not find on chain info.";
  }

  if (action.kind === "checkStatus") {
    return "A payout was submitted. Checking its status finalizes it: the spend is removed on success, or marked failed so it can be retried.";
  }

  if (action.kind === "queued") {
    return queueAhead > 0
      ? `Waiting in the payout order: ${queueAhead} spend(s) ahead. Only the next payout can be paid.`
      : "Waiting in the payout order. Only the next payout can be paid.";
  }

  if (action.kind === "wait") {
    if (
      !isNil(validFrom) &&
      !isNil(latestHeight) &&
      Number(validFrom) > Number(latestHeight)
    ) {
      return `Payable from block #${Number(validFrom).toLocaleString()}.`;
    }
    return "Waiting for the latest chain state.";
  }

  if (action.kind === "expire") {
    return "This spend is past its payout window and can no longer be paid. Checking its status settles it and promotes the next queued spend.";
  }

  if (action.kind === "rotate") {
    return "Its payout order expired while another spend is already mature. Rotate it to let the next spend be paid.";
  }

  if (action.kind === "requeue") {
    return "This spend is missing from the payout order. Checking its status adds it back to the queue.";
  }

  return null;
}

function PayoutContent({
  action,
  loading,
  error,
  queueAhead,
  validFrom,
  latestHeight,
  onOpen,
}) {
  const hint = getHint({
    action,
    loading,
    error,
    queueAhead,
    validFrom,
    latestHeight,
  });
  const label = (action?.call && ACTION_TITLES[action.kind]) || "Payout";

  return (
    <div className="flex flex-col gap-2">
      <Tooltip content={hint}>
        <PrimaryButton
          className="w-full"
          loading={loading}
          disabled={loading || !action?.call}
          onClick={onOpen}
        >
          {label}
        </PrimaryButton>
      </Tooltip>
      {!!hint && <p className="text12Medium text-textTertiary">{hint}</p>}
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
  const title = (call && ACTION_TITLES[payout.action.kind]) || "Payout";

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
