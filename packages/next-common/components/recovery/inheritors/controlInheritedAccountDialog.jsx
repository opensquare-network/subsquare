"use client";

import { useCallback, useState } from "react";
import { useContextApi } from "next-common/context/api";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import PopupLabel from "next-common/components/popup/label";
import Extrinsic from "next-common/components/extrinsic";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { ExtrinsicLoading } from "next-common/components/popup/fields/extrinsicField";
import AddressDisplay from "next-common/components/popup/fields/addressDisplay";
import Popup from "next-common/components/popup/wrapper/Popup";

function ControlInheritedAccountInnerPopup({ recovered, onInBlock }) {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [call, setCall] = useState(null);
  const disabled = !api || !call;

  const getTxFunc = useCallback(async () => {
    if (!api || !call) {
      return null;
    }
    return api.tx.recovery.controlInheritedAccount(recovered, call);
  }, [api, recovered, call]);

  const setProposal = useCallback(
    ({ isValid, data: tx } = {}) => {
      if (!api || !isValid || !tx) {
        setCall(null);
        return;
      }
      setCall(tx);
    },
    [api],
  );

  let extrinsicComponent = null;

  if (!api) {
    extrinsicComponent = <ExtrinsicLoading />;
  } else {
    extrinsicComponent = (
      <div className="flex flex-col gap-4">
        <div>
          <PopupLabel text="Call" />
          <Extrinsic
            defaultSectionName="balances"
            defaultMethodName="transferKeepAlive"
            setValue={setProposal}
          />
        </div>
      </div>
    );
  }

  return (
    <Popup
      title="Control Inherited Account"
      onClose={onClose}
      maskClosable={false}
    >
      <SignerWithBalance />
      <div>
        <PopupLabel text="Recovered" />
        <AddressDisplay address={recovered} />
      </div>
      {extrinsicComponent}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton
        disabled={disabled}
        getTxFunc={getTxFunc}
        onInBlock={onInBlock}
      />
    </Popup>
  );
}

export default function ControlInheritedAccountDialog({
  onClose,
  recovered,
  onInBlock,
}) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <ControlInheritedAccountInnerPopup
        recovered={recovered}
        onInBlock={onInBlock}
      />
    </SignerPopupWrapper>
  );
}
