import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useCallback, useMemo } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Signer from "next-common/components/popup/fields/signerField";
import useSubAssetBalance from "next-common/components/assets/useSubAssetBalance";

function PopupContent() {
  const { asset, onClose } = usePopupParams();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const dispatch = useDispatch();
  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({
    transferrable: asset.transferrable,
    decimals: asset.decimals,
    symbol: asset.symbol,
    transferFromAddress: address,
  });

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

    let amount;
    try {
      amount = getCheckedTransferAmount();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    return api.tx.assets.transfer(asset.assetId, transferToAddress, amount);
  }, [
    dispatch,
    api,
    asset,
    address,
    transferToAddress,
    getCheckedTransferAmount,
  ]);

  return (
    <>
      <Signer />
      {transferToAddressField}
      {transferAmountField}
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

export default function AssetTransferPopup(props) {
  const { asset: initialAsset, address } = props;
  const { result } = useSubAssetBalance(initialAsset.assetId, address);

  const updatedProps = useMemo(() => {
    const asset = result?.transferrable
      ? { ...initialAsset, ...result }
      : initialAsset;

    return {
      ...props,
      asset,
    };
  }, [props, initialAsset, result]);

  return (
    <PopupWithSigner title="Transfer" className="!w-[640px]" {...updatedProps}>
      <PopupContent />
    </PopupWithSigner>
  );
}
