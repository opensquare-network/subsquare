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
import {
  useExtensionAccounts,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useVestingContext } from "next-common/context/vesting";
import CurrencyInput from "next-common/components/currencyInput";
import NumberInput from "next-common/lib/input/number";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useVestedTransferForm from "./useVestedTransferForm";
import VestingInfoMessage from "./vestingInfoMessage";
import { TransferrableBalance } from "next-common/components/popup/fields/transferAmountField";
import { useChain } from "next-common/context/chain";
import { isRelayChain } from "next-common/utils/chain";
import { SystemQuestion } from "@osn/icons/subsquare";
import useAhmLatestHeight from "next-common/hooks/ahm/useAhmLatestheight";

function StartingHeightStatus() {
  const chain = useChain();
  const height = useAhmLatestHeight();

  if (!height) {
    return null;
  }

  const label = isRelayChain(chain) ? "Relay Chain Height" : "Current Height";

  return (
    <span className="text14Medium text-textTertiary">
      {label}: {height.toLocaleString()}
    </span>
  );
}

function StartingHeight() {
  const chain = useChain();
  if (!isRelayChain(chain)) {
    return "Starting Height";
  }

  return (
    <div className="inline-flex items-center space-x-1">
      <span>Starting Height</span>
      <Tooltip content="Vested transfer is determined by the Relay Chain block height">
        <SystemQuestion className="w-4 h-4 [&_path]:fill-textTertiary" />
      </Tooltip>
    </div>
  );
}

function TransferrableStatus() {
  const signerAccount = useSignerAccount();
  const signerAddress = signerAccount?.realAddress;
  const { value: balance, loading: balanceLoading } =
    useSubBalanceInfo(signerAddress);
  const { decimals } = useChainSettings();
  if (!signerAddress) {
    return null;
  }

  return (
    <TransferrableBalance
      value={balance?.transferrable}
      isLoading={balanceLoading}
      decimals={decimals}
    />
  );
}

function PopupContent() {
  const dispatch = useDispatch();
  const { symbol } = useChainSettings();
  const extensionAccounts = useExtensionAccounts();
  const { update: updateVestingData } = useVestingContext();

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
  } = useVestedTransferForm();

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Vested transfer successful"));
    updateVestingData();
  }, [dispatch, updateVestingData]);

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
        <PopupLabel text="Amount" status={<TransferrableStatus />} />
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
      <div>
        <PopupLabel
          text={<StartingHeight />}
          status={<StartingHeightStatus />}
        />
        <NumberInput
          value={startingBlock}
          placeholder="Starting height"
          onValueChange={setStartingBlock}
          controls={false}
        />
      </div>
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
