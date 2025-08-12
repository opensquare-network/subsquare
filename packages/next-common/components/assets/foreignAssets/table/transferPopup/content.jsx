import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Signer from "next-common/components/popup/fields/signerField";
import { isSameAddress } from "next-common/utils";
import { useContextApi } from "next-common/context/api";
import useCheckTransactionFee from "next-common/hooks/balance/useCheckTransactionFee";

function PopupContent() {
  const { asset } = usePopupParams();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const dispatch = useDispatch();

  const { checkTransactionFee } = useCheckTransactionFee(address);

  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({
    transferrable: asset.transferable,
    decimals: asset.decimals,
    symbol: asset.symbol,
    transferFromAddress: address,
  });

  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

  const getTxFunc = useCallback(async () => {
    if (!transferToAddress) {
      dispatch(newErrorToast("Please enter the recipient address"));
      return;
    }

    if (isSameAddress(transferToAddress, address)) {
      dispatch(newErrorToast("Cannot transfer to self"));
      return;
    }

    let amount;
    try {
      amount = getCheckedTransferAmount();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    const tx = api.tx.foreignAssets.transfer(
      asset.location,
      transferToAddress,
      amount,
    );

    const isBalanceSufficient = await checkTransactionFee(tx, address);
    if (!isBalanceSufficient) {
      return;
    }

    return tx;
  }, [
    dispatch,
    api,
    asset,
    address,
    transferToAddress,
    getCheckedTransferAmount,
    checkTransactionFee,
  ]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Transfer successfully"));
  }, [dispatch]);

  return (
    <>
      <Signer />
      {transferToAddressField}
      {transferAmountField}
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFunc}
          onInBlock={onInBlock}
        />
      </div>
    </>
  );
}

export default function ForeignAssetTransferPopupContent(props) {
  return (
    <PopupWithSigner title="Transfer" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
