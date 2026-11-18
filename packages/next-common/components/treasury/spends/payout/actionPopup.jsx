import { useCallback } from "react";
import { isNil } from "lodash-es";
import PopupWithSigner from "next-common/components/popupWithSigner";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import { useTreasuryPallet } from "next-common/context/treasury";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import ValueDisplay from "next-common/components/valueDisplay";
import { getPayoutActionLabel } from "./chainData";
import { getPayoutActionTx, getPayoutTxByCall } from "./chainTx";
import { usePayoutQueueIsDemo } from "./sourceContext";

const ACTION_HINTS = {
  rotate:
    "The payout order of this spend expired while another queued spend is already mature. Rotating moves it to the back of the queue and promotes the next spend.",
  expire:
    "This spend is past its payout window and can no longer be paid. Checking its status settles it: it is removed, or rotated once if its payout order also expired, and the next queued spend is promoted.",
  requeue:
    "This spend is not part of the payout order (it can be skipped when the queue was full). Checking its status adds it back to the queue.",
};

function SpendSummary({ spend, symbol }) {
  if (!spend) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2 rounded-xl bg-theme100 p-4">
      <div className="flex min-w-0 items-center gap-2">
        <span className="shrink-0 text14Bold text-textPrimary">
          #{spend.index}
        </span>
        <span className="truncate text14Bold text-textPrimary">
          {spend.title}
        </span>
      </div>
      {isNil(spend.amount) ? (
        <span>-</span>
      ) : (
        <ValueDisplay value={spend.amount} symbol={symbol} />
      )}
    </div>
  );
}

function Content({ spend, symbol, action }) {
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();
  const isDemo = usePayoutQueueIsDemo();

  const getTxFunc = useCallback(() => {
    if (isDemo) {
      return null;
    }
    if (action?.call) {
      return getPayoutTxByCall(api, treasuryPallet, action.call, spend?.index);
    }
    return getPayoutActionTx(api, treasuryPallet, spend?.status, spend?.index);
  }, [api, treasuryPallet, spend, action, isDemo]);

  return (
    <>
      {component}
      <SpendSummary spend={spend} symbol={symbol} />
      {!!ACTION_HINTS[action?.kind] && (
        <p className="text12Medium text-textTertiary">
          {ACTION_HINTS[action.kind]}
        </p>
      )}
      {isDemo && (
        <p className="text12Medium text-textTertiary">
          These spends are sample data. Transactions are disabled.
        </p>
      )}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton
        title={action?.label ?? getPayoutActionLabel(spend?.status)}
        getTxFunc={getTxFunc}
        disabled={isDemo}
      />
    </>
  );
}

export default function PayoutActionPopup({ spend, symbol, action, ...props }) {
  return (
    <PopupWithSigner
      title={action?.label ?? getPayoutActionLabel(spend?.status) ?? "Payout"}
      {...props}
    >
      <Content spend={spend} symbol={symbol} action={action} />
    </PopupWithSigner>
  );
}
