import IndentPanel from "next-common/components/callTreeView/indentPanel";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import EstimatedGas from "next-common/components/estimatedGas";
import IconButton from "next-common/components/iconButton";
import AddressComboField from "next-common/components/popup/fields/addressComboField";
import TransferAmount from "next-common/components/popup/fields/transferAmountField";
import PlusIcon from "next-common/components/callTreeView/plus";
import SubtractIcon from "next-common/components/callTreeView/subtract";
import { useExtensionAccounts } from "next-common/components/popupWithSigner/context";
import PreviousButton from "next-common/components/summary/newProposalButton/previousButton";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useContextApi } from "next-common/context/api";
import { useChainSettings } from "next-common/context/chain";
import { useStepContainer } from "next-common/context/stepContainer";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { useCallback, useEffect, useRef, useState } from "react";
import { noop, random } from "lodash-es";
import BigNumber from "bignumber.js";
import { checkTransferAmount } from "next-common/utils/checkTransferAmount";
import MultisigPopupWrapper from "../multisigPopupWraper";
import { useMultisigBalance } from "../context";

function generateKey() {
  return random();
}

function BatchTransferContent() {
  const { balance } = useMultisigBalance();
  const { goBack } = useStepContainer();
  const api = useContextApi();
  const { decimals } = useChainSettings();
  const extensionAccounts = useExtensionAccounts();
  const [transfers, setTransfers] = useState([]);

  useEffect(() => {
    setTransfers([{ key: generateKey() }]);
  }, []);

  const onAddTransfer = useCallback(() => {
    setTransfers((prev) => [...prev, { key: generateKey() }]);
  }, []);

  const onRemoveTransfer = useCallback(() => {
    setTransfers((prev) => {
      const index = prev.length - 1;
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const onTransferChange = useCallback((transfer, index) => {
    setTransfers((prev) => {
      const newTransfers = [...prev];
      newTransfers[index] = transfer;
      return newTransfers;
    });
  }, []);

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      if (transfers.length <= 0) {
        toastError("Please add at least one transfer");
        return;
      }
      if (transfers.some((transfer) => !transfer.targetAddress)) {
        toastError("Please select a target address");
        return;
      }
      if (transfers.some((transfer) => !transfer.transferAmount)) {
        toastError("Please enter a transfer amount");
        return;
      }

      const totalTransferAmount = transfers.reduce((sum, transfer) => {
        if (!transfer.transferAmount) return sum;
        const amount = new BigNumber(transfer.transferAmount);
        return sum.plus(amount);
      }, new BigNumber(0));

      checkTransferAmount({
        transferAmount: totalTransferAmount,
        decimals,
        transferrable: balance?.transferrable,
      });

      return api.tx.utility.batchAll(
        transfers.map((transfer) =>
          api.tx.balances?.transferKeepAlive(
            transfer.targetAddress,
            transfer.transferAmount,
          ),
        ),
      );
    },
    [api, transfers, balance, decimals],
  );

  return (
    <>
      <TransfersLabel>
        <TransferListActions
          onAddTransfer={onAddTransfer}
          onRemoveTransfer={onRemoveTransfer}
        />
      </TransfersLabel>
      <IndentPanel className="flex flex-col gap-y-4">
        {transfers.map((transfer, index) => (
          <IndentPanel key={index} className="flex flex-col gap-y-4">
            <span className="text-textSecondary">#{index + 1}</span>
            <TransferField
              extensionAccounts={extensionAccounts}
              onTransferChange={(transfer) => onTransferChange(transfer, index)}
            />
          </IndentPanel>
        ))}
      </IndentPanel>

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

export default function BatchTransfer() {
  return (
    <MultisigPopupWrapper>
      <BatchTransferContent />
    </MultisigPopupWrapper>
  );
}

function TransferField({ extensionAccounts = [], onTransferChange = noop }) {
  const [targetAddress, setTargetAddress] = useState();
  const { decimals, symbol } = useChainSettings();
  const [transferAmount, setTransferAmount] = useState("");
  const onTransferChangeRef = useRef(onTransferChange);

  useEffect(() => {
    onTransferChangeRef.current = onTransferChange;
  }, [onTransferChange]);

  useEffect(() => {
    onTransferChangeRef.current({ targetAddress, transferAmount });
  }, [targetAddress, transferAmount]);

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
        decimals={decimals}
        symbol={symbol}
        transferAmount={transferAmount}
        setTransferAmount={setTransferAmount}
      />
    </>
  );
}

function TransfersLabel({ children }) {
  return (
    <span className="text14Bold flex items-center gap-x-1 justify-between">
      Transfers<span className="text-textSecondary">{children}</span>
    </span>
  );
}

function TransferListActions({ onAddTransfer, onRemoveTransfer }) {
  return (
    <div className="flex items-center gap-1">
      <IconButton
        onClick={onAddTransfer}
        className="[&_svg_path]:!stroke-none [&_svg_path]:!fill-theme500"
      >
        <PlusIcon /> Add
      </IconButton>
      <IconButton onClick={onRemoveTransfer}>
        <SubtractIcon />
        Remove
      </IconButton>
    </div>
  );
}
