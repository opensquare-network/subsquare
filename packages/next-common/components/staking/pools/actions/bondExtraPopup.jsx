import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useCallback, useState } from "react";
import AmountInputWithHint from "next-common/components/popup/fields/amountInputWithHint";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import BigNumber from "bignumber.js";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Signer from "next-common/components/popup/fields/signerField";
import ErrorMessage from "next-common/components/styled/errorMessage";

function BondExtraPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const realAddress = useRealAddress();
  const [amount, setAmount] = useState();
  const { decimals, symbol } = useChainSettings();

  const { transferrable, isLoading: isLoadingTransferrable } =
    useAccountTransferrable(api, realAddress);

  const exceedMax =
    transferrable &&
    amount &&
    BigNumber(amount).gt(BigNumber(transferrable).div(Math.pow(10, decimals)));

  let errorMessage = "";
  if (exceedMax) {
    errorMessage = "Input amount exceeds available balance.";
  }

  const getTxFunc = useCallback(() => {
    if (!api || !api.tx.nominationPools) {
      return;
    }

    const checkedAmount = checkTransferAmount({
      transferAmount: amount,
      decimals,
      transferrable,
    });

    return api.tx.nominationPools.bondExtra({
      FreeBalance: checkedAmount,
    });
  }, [api, amount, decimals, transferrable]);

  return (
    <div className="space-y-4">
      <Signer title="Origin" noSwitchSigner />
      <AmountInputWithHint
        title="Amount"
        hintLabel="Available"
        maxAmount={transferrable}
        inputAmount={amount}
        setInputAmount={setAmount}
        isLoading={isLoadingTransferrable}
        decimals={decimals}
        symbol={symbol}
        hintTooltip={`${BigNumber(transferrable)
          .div(Math.pow(10, decimals))
          .toString()} ${symbol} is available.`}
      />
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
      <div className="flex justify-between">
        <SecondaryButton onClick={onClose}>Cancel</SecondaryButton>
        <TxSubmissionButton
          disabled={isLoadingTransferrable || exceedMax}
          getTxFunc={getTxFunc}
        />
      </div>
    </div>
  );
}

export default function BondExtraPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Bond Extra" onClose={onClose}>
        <BondExtraPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
