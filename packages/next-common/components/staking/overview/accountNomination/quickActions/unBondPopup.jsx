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
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { useMyStakingLedger } from "next-common/context/staking/myStakingLedger";

function UnBondPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [amount, setAmount] = useState();
  const { decimals, symbol } = useChainSettings();
  const { ledger } = useMyStakingLedger();
  const bonded = ledger?.active || 0;

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api || !api.tx.staking) {
        return;
      }

      const checkedAmount = checkTransferAmount({
        transferAmount: amount,
        decimals,
      });

      if (BigNumber(checkedAmount).gt(bonded)) {
        toastError(
          `Amount must be less than or equal to your bonded amount of ${toPrecision(
            bonded,
            decimals,
          )} ${symbol}`,
        );
        return;
      }

      return api.tx.staking.unbond(checkedAmount);
    },
    [api, amount, bonded, decimals, symbol],
  );

  return (
    <div className="space-y-4">
      <Signer
        noSwitchSigner
        balanceName="Bonded"
        balance={bonded}
        isBalanceLoading={false}
      />
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

export default function UnBondPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Unbond" onClose={onClose}>
        <UnBondPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
