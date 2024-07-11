import AddressComboField from "next-common/components/popup/fields/addressComboField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  usePopupParams,
} from "next-common/components/popupWithSigner/context";
import { useCallback, useState } from "react";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import BigNumber from "bignumber.js";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import BalanceDisplay from "../balanceDisplay";
import { formatBalance } from "../assetsList";

function PopupContent({ getTransferTx }) {
  const { asset, onClose } = usePopupParams();
  const address = useRealAddress();
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
  const [transferToAddress, setTransferToAddress] = useState("");
  const [transferAmount, setTransferAmount] = useState("");

  const getTxFunc = useCallback(() => {
    if (!transferToAddress) {
      dispatch(newErrorToast("Please enter the recipient address"));
      return;
    }

    if (transferToAddress === address) {
      dispatch(newErrorToast("Cannot transfer to self"));
      return;
    }

    if (!transferAmount) {
      dispatch(newErrorToast("Please enter the amount"));
      return;
    }

    const amount = new BigNumber(transferAmount).times(
      Math.pow(10, asset.decimals),
    );

    if (amount.isNaN() || amount.lte(0)) {
      dispatch(newErrorToast("Invalid amount"));
      return;
    }

    if (amount.gt(asset.transferrable)) {
      dispatch(newErrorToast("Insufficient balance"));
      return;
    }

    return getTransferTx(transferToAddress, amount.toFixed());
  }, [
    dispatch,
    asset,
    address,
    transferToAddress,
    transferAmount,
    getTransferTx,
  ]);

  const balanceStatus = (
    <div className="flex gap-[8px] items-center mb-[8px]">
      <span className="text12Medium text-textTertiary">Transferable</span>
      <BalanceDisplay
        balance={formatBalance(asset.transferrable || 0, asset.decimals)}
      />
    </div>
  );

  return (
    <>
      <div>
        <PopupLabel text="Amount" status={balanceStatus} />
        <Input
          type="text"
          placeholder="0.00"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value.replace("。", "."))}
          symbol={asset.symbol}
        />
      </div>
      <AddressComboField
        title="To"
        defaultAddress=""
        extensionAccounts={extensionAccounts}
        setAddress={setTransferToAddress}
        placeholder="Please fill the address or select another one..."
      />
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onClose={onClose}
        />
      </div>
    </>
  );
}

export function AssetTransferPopup(props) {
  const api = useContextApi();
  const { asset } = props;

  return (
    <PopupWithSigner title="Send" className="w-[640px]" {...props}>
      <PopupContent
        getTransferTx={(address, amount) => {
          return api.tx.assets.transfer(asset.assetId, address, amount);
        }}
      />
    </PopupWithSigner>
  );
}
