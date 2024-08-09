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
import Description from "./description";
import CrossChain from "./crossChain";

function PopupContent({ type }) {
  const { asset, onClose } = usePopupParams();
  const api = useContextApi();
  const address = useRealAddress();
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
  const [toAddress, setToAddress] = useState("");
  const [amount, setAmount] = useState("");

  const getTxFunc = useCallback(() => {
    if (!toAddress) {
      dispatch(newErrorToast("Please enter the recipient address"));
      return;
    }

    if (toAddress === address) {
      dispatch(newErrorToast("Cannot transfer to self"));
      return;
    }

    if (!amount) {
      dispatch(newErrorToast("Please enter the amount"));
      return;
    }

    const amount = new BigNumber(amount).times(Math.pow(10, asset.decimals));

    if (amount.isNaN() || amount.lte(0)) {
      dispatch(newErrorToast("Invalid amount"));
      return;
    }

    if (amount.gt(asset.transferrable)) {
      dispatch(newErrorToast("Insufficient balance"));
      return;
    }

    return api.tx.assets.transfer(asset.assetId, toAddress, amount.toFixed());
  }, [dispatch, api, asset, address, toAddress, amount]);

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
        <Description type={type} />
      </div>
      {type === "crossChain" && (
        <div>
          <CrossChain />
        </div>
      )}
      <div>
        <PopupLabel text="Amount" status={balanceStatus} />
        <Input
          type="text"
          placeholder="0.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value.replace("。", "."))}
          symbol={asset.symbol}
        />
      </div>
      <AddressComboField
        title="To"
        extensionAccounts={extensionAccounts}
        setAddress={setToAddress}
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

const PopupTitle = (type) => (type === "transfer" ? "Transfer" : "Cross-chain");

export function AssetOperationPopup(props) {
  return (
    <PopupWithSigner
      title={PopupTitle(props.operationType)}
      className="!w-[640px]"
      {...props}
    >
      <PopupContent type={props.operationType} />
    </PopupWithSigner>
  );
}
