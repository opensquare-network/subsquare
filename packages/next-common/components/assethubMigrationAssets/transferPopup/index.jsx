import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import { useCallback } from "react";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useContextApi } from "next-common/context/api";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import Signer from "next-common/components/popup/fields/signerField";
import { isSameAddress } from "next-common/utils";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";

function PopupContent() {
  const { asset } = usePopupParams();
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
  });

  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

  const getTxFunc = useCallback(() => {
    if (!transferToAddress) {
      throw new Error("Please enter the recipient address");
    }

    if (isSameAddress(transferToAddress, address)) {
      throw new Error("Cannot transfer to self");
    }

    const amount = getCheckedTransferAmount();

    return api.tx.assets.transfer(asset.assetId, transferToAddress, amount);
  }, [api, asset, address, transferToAddress, getCheckedTransferAmount]);

  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Transfer successfully"));
  }, [dispatch]);

  return (
    <>
      <Signer />
      {transferToAddressField}
      {transferAmountField}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFunc} />
      </AdvanceSettings>
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

export default function AssetTransferPopup(props) {
  return (
    <PopupWithSigner title="Transfer" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
