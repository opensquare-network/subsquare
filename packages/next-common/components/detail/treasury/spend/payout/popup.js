import PopupWithSigner from "next-common/components/popupWithSigner";
import React, { useCallback } from "react";
import useSigner from "next-common/components/common/tx/useSigner";
import { useContextApi } from "next-common/context/api";
import { useOnchainData } from "next-common/context/post";
import { isNil, noop } from "lodash-es";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useTreasuryPallet } from "next-common/context/treasury";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

function Content({
  onSubmitted = noop,
  onInBlock = noop,
  onTxError = noop,
  onCancelled = noop,
  onTxStart = noop,
}) {
  const { component } = useSigner("Origin");
  const api = useContextApi();
  const { index } = useOnchainData() || {};
  const treasuryPallet = useTreasuryPallet();

  const getTxFunc = useCallback(() => {
    if (api && !isNil(index)) {
      return api.tx[treasuryPallet].payout(index);
    }
  }, [api, index, treasuryPallet]);

  return (
    <>
      {component}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton
        title="Pay"
        getTxFunc={getTxFunc}
        onSubmitted={onSubmitted}
        onInBlock={onInBlock}
        onTxError={onTxError}
        onCancelled={onCancelled}
        onTxStart={onTxStart}
      />
    </>
  );
}

export default function Popup({
  onSubmitted,
  onInBlock,
  onTxError,
  onCancelled,
  onTxStart,
  ...props
}) {
  return (
    <PopupWithSigner title="Payout" {...props}>
      <Content
        onSubmitted={onSubmitted}
        onInBlock={onInBlock}
        onTxError={onTxError}
        onCancelled={onCancelled}
        onTxStart={onTxStart}
      />
    </PopupWithSigner>
  );
}
