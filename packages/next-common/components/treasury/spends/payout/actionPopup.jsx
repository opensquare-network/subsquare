import { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import { useTreasuryPallet } from "next-common/context/treasury";
import PopupWithSigner from "next-common/components/popupWithSigner";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import SpendSummary from "./spendSummary";
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

function ActionHint({ action }) {
  if (!ACTION_HINTS[action?.kind]) {
    return null;
  }

  return (
    <p className="text12Medium text-textTertiary">
      {ACTION_HINTS[action.kind]}
    </p>
  );
}

function Content({ spend, symbol, action }) {
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();
  const isDemo = usePayoutQueueIsDemo();

  const getTxFunc = useCallback(() => {
    // Demo spends are sample data, never build a real call for them
    if (isDemo) {
      return null;
    }
    if (action?.call) {
      return getPayoutTxByCall(api, treasuryPallet, action.call, spend?.index);
    }
    return getPayoutActionTx(api, treasuryPallet, spend?.status, spend?.index);
  }, [api, treasuryPallet, spend, action, isDemo]);

  const title = action?.label ?? getPayoutActionLabel(spend?.status);

  return (
    <>
      {component}
      <SpendSummary spend={spend} symbol={symbol} />
      <ActionHint action={action} />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton title={title} getTxFunc={getTxFunc} />
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
