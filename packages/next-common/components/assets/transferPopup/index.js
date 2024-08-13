import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import BigNumber from "bignumber.js";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useTransferAmount from "./useTransferAmount";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Signer from "next-common/components/popup/fields/signerField";

function PopupContent() {
  const { asset, onClose } = usePopupParams();
  const api = useContextApi();
  const address = useRealAddress();
  const dispatch = useDispatch();
  const { value: transferAmount, component: transferAmountField } =
    useTransferAmount({ asset, transferFromAddress: address });
  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

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

    return api.tx.assets.transfer(
      asset.assetId,
      transferToAddress,
      amount.toFixed(),
    );
  }, [dispatch, api, asset, address, transferToAddress, transferAmount]);

  return (
    <>
      <Signer />
      {transferAmountField}
      {transferToAddressField}
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
  return (
    <PopupWithSigner title="Transfer" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
