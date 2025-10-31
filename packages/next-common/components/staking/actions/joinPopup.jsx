import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useMinJoin } from "next-common/components/staking/pools/hooks/useMinJoin";
import { toPrecision } from "next-common/utils";
import { useState } from "react";
import BalanceField from "next-common/components/popup/fields/balanceField";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import SecondaryButton from "next-common/lib/button/secondary";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import BigNumber from "bignumber.js";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";

function JoinPopupContent() {
  const { onClose, poolId } = usePopupParams();
  const api = useContextApi();
  const { minJoinBond, loading: minJoinBondLoading } = useMinJoin();
  const [amount, setAmount] = useState();
  const { decimals, symbol } = useChainSettings();

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api || !api.tx.nominationPools) {
        return;
      }

      const checkedAmount = checkTransferAmount({
        transferAmount: amount,
        decimals,
      });

      if (BigNumber(checkedAmount).lt(minJoinBond)) {
        toastError(
          `Amount must be greater than the min join bond of ${toPrecision(
            minJoinBond,
            decimals,
          )} ${symbol}`,
        );
        return;
      }

      return api.tx.nominationPools.join(checkedAmount, poolId);
    },
    [api, amount, minJoinBond],
  );

  return (
    <div className="space-y-4">
      <SignerWithBalance showTransferable />
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
        <TxSubmissionButton
          loading={minJoinBondLoading}
          getTxFunc={getTxFuncForSubmit}
        />
      </div>
    </div>
  );
}

export default function JoinPopup({ onClose, poolId }) {
  return (
    <SignerPopupWrapper onClose={onClose} poolId={poolId}>
      <Popup title="Join Pool" onClose={onClose}>
        <JoinPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
