import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import PopupWithSigner from "next-common/components/popupWithSigner";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import BalanceField from "next-common/components/popup/fields/balanceField";
import PopupLabel from "next-common/components/popup/label";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import { checkInputValue } from "next-common/utils";
import NumberInput from "next-common/lib/input/number";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";

function PopupContent() {
  const dispatch = useDispatch();
  const api = useContextApi();
  const { decimals, symbol } = useChainSettings();
  const extensionAccounts = useExtensionAccounts();

  const [targetAddress, setTargetAddress] = useState("");
  const [lockedAmount, setLockedAmount] = useState("");
  const [startingBlock, setStartingBlock] = useState("");
  const [perBlock, setPerBlock] = useState("");

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const getTxFunc = useCallback(() => {
    if (!api) {
      showErrorToast("Chain network is not connected yet");
      return;
    }

    if (!targetAddress) {
      showErrorToast("Please input a target address");
      return;
    }

    if (!lockedAmount) {
      showErrorToast("Please input locked amount");
      return;
    }

    if (!startingBlock) {
      showErrorToast("Please input starting block");
      return;
    }

    if (!perBlock) {
      showErrorToast("Please input per block amount");
      return;
    }

    let bnLockedAmount;
    try {
      bnLockedAmount = checkInputValue(lockedAmount, decimals, "locked amount");
    } catch (e) {
      showErrorToast(e.message);
      return;
    }

    let bnPerBlock;
    try {
      bnPerBlock = checkInputValue(perBlock, decimals, "per block amount");
    } catch (e) {
      showErrorToast(e.message);
      return;
    }

    const schedule = {
      locked: bnLockedAmount.toString(),
      perBlock: bnPerBlock.toString(),
      startingBlock: parseInt(startingBlock),
    };

    return api.tx.vesting.vestedTransfer(targetAddress, schedule);
  }, [
    api,
    targetAddress,
    lockedAmount,
    startingBlock,
    perBlock,
    decimals,
    showErrorToast,
  ]);

  const getEstimateTxFunc = useCallback(() => {
    if (
      !api ||
      !targetAddress ||
      !lockedAmount ||
      !startingBlock ||
      !perBlock
    ) {
      return;
    }

    let bnLockedAmount;
    let bnPerBlock;
    try {
      bnLockedAmount = checkInputValue(lockedAmount, decimals, "locked amount");
      bnPerBlock = checkInputValue(perBlock, decimals, "per block amount");
    } catch {
      return;
    }

    const schedule = {
      locked: bnLockedAmount.toString(),
      perBlock: bnPerBlock.toString(),
      startingBlock: parseInt(startingBlock),
    };

    return api.tx.vesting.vestedTransfer(targetAddress, schedule);
  }, [api, targetAddress, lockedAmount, startingBlock, perBlock, decimals]);

  return (
    <>
      <SignerWithBalance noSwitchSigner />
      <AddressComboField
        title="Target Address"
        extensionAccounts={extensionAccounts}
        setAddress={setTargetAddress}
        placeholder="Please fill the address or select another one..."
      />
      <BalanceField
        title="Locked Amount"
        inputBalance={lockedAmount}
        setInputBalance={setLockedAmount}
        symbol={symbol}
      />
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
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getEstimateTxFunc} />
      </AdvanceSettings>
      <TxSubmissionButton title="Submit" getTxFunc={getTxFunc} />
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
