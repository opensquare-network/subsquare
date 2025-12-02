import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Signer from "next-common/components/popup/fields/signerField";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useState } from "react";
import BalanceField from "next-common/components/popup/fields/balanceField";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";

function BondPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [amount, setAmount] = useState();
  const { decimals, symbol } = useChainSettings();

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(() => {
    if (!api || !api.tx.staking) {
      return;
    }

    const checkedAmount = checkTransferAmount({
      transferAmount: amount,
      decimals,
    });

    return api.tx.staking.bondExtra(checkedAmount);
  }, [api, amount, decimals]);

  return (
    <div className="space-y-4">
      <SignerWithBalance noSwitchSigner />
      <BalanceField
        title="Amount"
        inputBalance={amount}
        setInputBalance={setAmount}
        symbol={symbol}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <TxSubmissionButton getTxFunc={getTxFuncForSubmit} />
      </div>
    </div>
  );
}

export default function BondPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Add to Bond" onClose={onClose}>
        <BondPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
