import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import Signer from "next-common/components/popup/fields/signerField";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useMemo, useState } from "react";
import BalanceField from "next-common/components/popup/fields/balanceField";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import BigNumber from "bignumber.js";
import { toPrecision } from "next-common/utils";
import { useMyPool } from "../context/myPool";

function UnBondPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const [amount, setAmount] = useState();
  const { decimals, symbol } = useChainSettings();
  const realAddress = useRealAddress();
  const { poolMember } = useMyPool();
  const bonded = useMemo(() => poolMember?.points || 0, [poolMember?.points]);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api || !api.tx.nominationPools) {
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

      return api.tx.nominationPools.unbond(realAddress, checkedAmount);
    },
    [api, amount, realAddress, bonded, decimals, symbol],
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
      <Popup title="Unbond Pool" onClose={onClose}>
        <UnBondPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
