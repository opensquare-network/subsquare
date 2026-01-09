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
import CurrencyInput from "next-common/components/currencyInput";
import NumberInput from "next-common/lib/input/number";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import useVestedTransferForm from "./useVestedTransferForm";
import VestingInfoMessage from "./vestingInfoMessage";
import { TransferrableBalance } from "next-common/components/popup/fields/transferAmountField";

function PopupContent() {
  const { decimals, symbol } = useChainSettings();
  const extensionAccounts = useExtensionAccounts();
  const signerAccount = useSignerAccount();
  const signerAddress = signerAccount?.realAddress;
  const { value: balance, loading: balanceLoading } =
    useSubBalanceInfo(signerAddress);

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

  const transferrableStatus = signerAddress && (
    <TransferrableBalance
      value={balance?.transferrable}
      isLoading={balanceLoading}
      decimals={decimals}
    />
  );

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
        <PopupLabel text="Locked Amount" status={transferrableStatus} />
        <CurrencyInput
          value={lockedAmount}
          onValueChange={setLockedAmount}
          symbol={symbol}
          placeholder="0.00"
        />
      </div>
      <div>
        <PopupLabel text="Per Block" />
        <NumberInput
          value={perBlock}
          placeholder="Amount unlocked per block"
          onValueChange={setPerBlock}
          symbol={symbol}
          controls={false}
        />
      </div>
      <div>
        <PopupLabel text="Starting Block" />
        <NumberInput
          value={startingBlock}
          placeholder="Block number"
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
