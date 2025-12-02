import BigNumber from "bignumber.js";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Signer from "next-common/components/popup/fields/signerField";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";
import { useCallback } from "react";

function StopNominatingPopupContent() {
  const api = useContextApi();
  const { ledger, loading } = useMyStakingLedger();
  const bond = ledger?.active || 0;

  const getTxFunc = useCallback(() => {
    if (new BigNumber(bond).isZero()) {
      return api.tx.staking.chill();
    }
    return api.tx.utility.batchAll([
      api.tx.staking.chill(),
      api.tx.staking.unbond(bond),
    ]);
  }, [api, bond]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner />
      <div className="flex justify-end">
        <TxSubmissionButton disabled={loading} getTxFunc={getTxFunc} />
      </div>
    </div>
  );
}

export default function StopNominationPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Stop Nominating" onClose={onClose}>
        <StopNominatingPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
