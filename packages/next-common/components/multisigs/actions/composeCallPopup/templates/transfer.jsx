import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import EstimatedGas from "next-common/components/estimatedGas";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { useState } from "react";
import PreviousButton from "next-common/components/summary/newProposalButton/previousButton";
import { useStepContainer } from "next-common/context/stepContainer";
import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import MultisigPopupWrapper from "../multisigPopupWraper";
import { useMultisigBalance } from "../context";

function TransferContent() {
  const { goBack } = useStepContainer();
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const [targetAddress, setTargetAddress] = useState();
  const [transferAmount, setTransferAmount] = useState("");
  const extensionAccounts = useExtensionAccounts();
  const { balance } = useMultisigBalance();

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!targetAddress) {
        toastError("Please select a target address");
        return;
      }

      const amount = checkTransferAmount({
        transferAmount,
        decimals,
        transferrable: balance?.transferrable,
      });

      return api.tx.balances?.transferKeepAlive(targetAddress, amount);
    },
    [api, targetAddress, balance, decimals, transferAmount],
  );

  return (
    <>
      <AddressComboField
        title="To"
        extensionAccounts={extensionAccounts}
        setAddress={setTargetAddress}
      />
      <TransferAmount
        showBalance={false}
        transferFromAddress={targetAddress}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
        decimals={decimals}
        symbol={symbol}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <PreviousButton onClick={goBack} />
        <TxSubmissionButton title="Confirm" getTxFunc={getTxFuncForSubmit} />
      </div>
    </>
  );
}

export default function Transfer() {
  return (
    <MultisigPopupWrapper>
      <TransferContent />
    </MultisigPopupWrapper>
  );
}
