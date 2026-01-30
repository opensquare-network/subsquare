import { useCallback } from "react";
import { useDispatch } from "react-redux";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import PopupLabel from "next-common/components/popup/label";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import Tooltip from "next-common/components/tooltip";
import { useChainSettings } from "next-common/context/chain";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import CurrencyInput from "next-common/components/currencyInput";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useVestedTransferForm from "./useVestedTransferForm";
import VestingInfoMessage from "./vestingInfoMessage";
import { TransferrableBalance } from "next-common/components/popup/fields/transferAmountField";
import StartingHeightField from "./startingHeightField";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

function PopupContent() {
  const dispatch = useDispatch();
  const { symbol, decimals } = useChainSettings();
  const extensionAccounts = useExtensionAccounts();
  const realAddress = useRealAddress();
  const { value: balance, loading: balanceLoading } =
    useSubBalanceInfo(realAddress);

  const {
    targetAddress,
    setTargetAddress,
    lockedAmount,
    setLockedAmount,
    startingBlock,
    setStartingBlock,
    perBlock,
    setPerBlock,
    getTxFunc,
    getEstimateTxFunc,
    disabledReason,
  } = useVestedTransferForm(balance?.transferrable);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Vested transfer successful"));
  }, [dispatch]);

  return (
    <>
      <SignerWithBalance noSwitchSigner />
      <AddressComboField
        title="Target Address"
        extensionAccounts={extensionAccounts}
        setAddress={setTargetAddress}
        placeholder="Please fill the address or select another one..."
      />
      <div>
        <PopupLabel
          text="Amount"
          status={
            <TransferrableBalance
              value={balance?.transferrable}
              isLoading={balanceLoading}
              decimals={decimals}
            />
          }
        />
        <CurrencyInput
          value={lockedAmount}
          onValueChange={setLockedAmount}
          symbol={symbol}
          placeholder="0.00"
        />
      </div>
      <div>
        <PopupLabel text="Per Block" />
        <CurrencyInput
          value={perBlock}
          placeholder="Amount unlocked per block"
          onValueChange={setPerBlock}
          symbol={symbol}
        />
      </div>
      <StartingHeightField value={startingBlock} setValue={setStartingBlock} />
      <VestingInfoMessage
        targetAddress={targetAddress}
        lockedAmount={lockedAmount}
        perBlock={perBlock}
        startingBlock={startingBlock}
      />
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getEstimateTxFunc} />
      </AdvanceSettings>
      <div className="flex w-full justify-end">
        <Tooltip content={disabledReason}>
          <TxSubmissionButton
            title="Submit"
            getTxFunc={getTxFunc}
            onInBlock={onInBlock}
            disabled={!!disabledReason}
          />
        </Tooltip>
      </div>
    </>
  );
}

export default function VestedTransferPopup({ onClose }) {
  return (
    <PopupWithSigner title="Vested Transfer" onClose={onClose}>
      <PopupContent />
    </PopupWithSigner>
  );
}
