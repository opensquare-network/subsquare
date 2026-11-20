import { useState } from "react";
import { usePostState } from "next-common/context/post";
import dynamicPopup from "next-common/lib/dynamic/popup";
import PrimaryButton from "next-common/lib/button/primary";
import Link from "next-common/components/link";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { useChainSettings } from "next-common/context/chain";
import {
  getPayoutActionHint,
  getPayoutActionLabel,
} from "next-common/components/treasury/spends/payout/chainData";

const Popup = dynamicPopup(() => import("./popup"));

const BALANCE_BLOCKED_HINT =
  "The treasury balance is lower than this payout, so the call would fail. Top up the treasury first.";
const STALE_ACTION_HINT =
  "The payout order changed after this dialog was opened. Close it and confirm the new action.";

// The button always names the payout action; why it is not clickable is
// explained by the tooltip instead of the label
function getActionLabel(action, status) {
  if (action?.call) {
    return action.label;
  }

  return getPayoutActionLabel(status) ?? "Payout";
}

// Text link styled like the beneficiary link, the queue page is a separate view
function PayoutQueueLink({ queueId }) {
  return (
    <Link
      href={{
        pathname: "/treasury/spends/queues",
        query: { queue: queueId.toLowerCase() },
      }}
      className="text12Medium text-sapphire500 hover:!no-underline"
    >
      View payout queue
      <span className="text-textTertiary ml-1 relative -top-[1px]">↗</span>
    </Link>
  );
}

function PayoutContent({
  action,
  balanceBlocked,
  loading,
  error,
  queueAhead,
  isHead,
  inOrder,
  orderEnabled,
  queueId,
  status,
  validFrom,
  spendExpireAt,
  latestHeight,
  onOpen,
}) {
  const { blockTime } = useChainSettings();
  const hint = getPayoutActionHint({
    action,
    loading,
    error,
    isHead,
    inOrder,
    queueAhead,
    validFrom,
    spendExpireAt,
    latestHeight,
    blockTime,
  });
  const label = getActionLabel(action, status);
  const disabled = loading || !action?.call || balanceBlocked;
  const tooltip = balanceBlocked ? BALANCE_BLOCKED_HINT : hint;
  // The queue page is only meaningful on runtimes that have the payout order
  const showQueueLink = orderEnabled && !!queueId;

  return (
    <div className="flex flex-col gap-2">
      <Tooltip className="w-full" content={tooltip}>
        <PrimaryButton
          className={cn(
            "w-full",
            // A disabled button swallows pointer events, which would hide the
            // tooltip explaining why it cannot be clicked
            disabled && "pointer-events-none",
          )}
          loading={loading}
          disabled={disabled}
          onClick={onOpen}
        >
          {label}
        </PrimaryButton>
      </Tooltip>
      {!!tooltip && !!action?.call && (
        <p className="text12Medium text-textTertiary">{tooltip}</p>
      )}
      {showQueueLink && <PayoutQueueLink queueId={queueId} />}
    </div>
  );
}

export default function TreasurySpendPay({ payout }) {
  // Freeze the action confirmed by the user: chain state can change while the
  // popup is open and the signed call must be the one that was shown.
  const [openedAction, setOpenedAction] = useState(null);
  const state = usePostState();
  const call = payout.action?.call;

  // The indexer marks a spend `Paid` as soon as the payout is submitted, while
  // on chain it is still `Attempted` (needs `check_status`) or `Failed` (can be
  // retried, possibly from the queue). Only `Processed`, or a spend that is
  // gone from chain storage, means it is finished.
  const finished =
    state === "Processed" ||
    (!payout.spendLoading && !payout.spendExists) ||
    // Do not flash a payout button while a `Paid` spend's chain state is read
    (state === "Paid" && payout.spendLoading);

  if (finished) {
    return null;
  }

  // A frozen action that the chain no longer accepts must not be signed
  const stale = !!openedAction && !payout.loading && call !== openedAction.call;
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
          disabled={stale}
          tooltip={stale ? STALE_ACTION_HINT : undefined}
          onClose={() => setOpenedAction(null)}
        />
      )}
    </>
  );
}
