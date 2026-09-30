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
import { getPayoutActionTx } from "./chainTx";

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

function Content({ spend, symbol }) {
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const treasuryPallet = useTreasuryPallet();

  const getTxFunc = useCallback(
    () => getPayoutActionTx(api, treasuryPallet, spend?.status, spend?.index),
    [api, treasuryPallet, spend],
  );

  return (
    <>
      {component}
      <SpendSummary spend={spend} symbol={symbol} />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton
        title={getPayoutActionLabel(spend?.status)}
        getTxFunc={getTxFunc}
      />
    </>
  );
}

export default function PayoutActionPopup({ spend, symbol, ...props }) {
  return (
    <PopupWithSigner
      title={getPayoutActionLabel(spend?.status) ?? "Payout"}
      {...props}
    >
      <Content spend={spend} symbol={symbol} />
    </PopupWithSigner>
  );
}
