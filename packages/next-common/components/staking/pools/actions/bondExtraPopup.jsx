import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import Popup from "next-common/components/popup/wrapper/Popup";
import SignerPopupWrapper from "next-common/components/popupWithSigner/signerPopupWrapper";
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
import CommonSelectField from "next-common/components/popup/fields/commonSelectField";
import useAccountTransferrable from "next-common/hooks/useAccountTransferrable";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import Signer from "next-common/components/popup/fields/signerField";

const FREE_BALANCE_TYPE = "FreeBalance";
const REWARDS_TYPE = "Rewards";

const TYPE_OPTIONS = [
  {
    label: "Free Balance",
    value: FREE_BALANCE_TYPE,
  },
  {
    label: "Rewards",
    value: REWARDS_TYPE,
  },
];

function BondExtraPopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const realAddress = useRealAddress();
  const { minJoinBond, loading: minJoinBondLoading } = useMinJoin();
  const [amount, setAmount] = useState();
  const { decimals, symbol } = useChainSettings();
  const [type, setType] = useState(TYPE_OPTIONS[0].value);

  const { transferrable, isLoading: isLoadingTransferrable } =
    useAccountTransferrable(api, realAddress);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (!api || !api.tx.nominationPools) {
        return;
      }

      const checkedAmount = checkTransferAmount({
        transferAmount: amount,
        decimals,
        transferrable,
      });

      if (BigNumber(checkedAmount).lt(minJoinBond)) {
        toastError(
          `Amount must be greater than the min bond extra of ${toPrecision(
            minJoinBond,
            decimals,
          )} ${symbol}`,
        );
        return;
      }

      const extra =
        type === FREE_BALANCE_TYPE
          ? {
              FreeBalance: checkedAmount,
            }
          : "Rewards";

      return api.tx.nominationPools.bondExtra(extra);
    },
    [api, amount, minJoinBond, type],
  );

  return (
    <div className="space-y-4">
      <Signer
        title="Origin"
        balance={transferrable}
        isBalanceLoading={isLoadingTransferrable}
        noSwitchSigner
        showTransferable
      />
      <CommonSelectField
        title="Type"
        options={TYPE_OPTIONS}
        value={type}
        setValue={(value) => setType(value)}
      />
      {type === FREE_BALANCE_TYPE && (
        <BalanceField
          title="Amount"
          inputBalance={amount}
          setInputBalance={setAmount}
          symbol={symbol}
        />
      )}
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

export default function BondExtraPopup({ onClose }) {
  return (
    <SignerPopupWrapper onClose={onClose}>
      <Popup title="Bond Extra" onClose={onClose}>
        <BondExtraPopupContent />
      </Popup>
    </SignerPopupWrapper>
  );
}
