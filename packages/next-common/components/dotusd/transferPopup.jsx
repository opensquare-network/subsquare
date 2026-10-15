import { useCallback } from "react";
import { isNil } from "lodash-es";
import { useDispatch } from "react-redux";
import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  usePopupParams,
  useSignerAccount,
} from "next-common/components/popupWithSigner/context";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import SignerWithBalance from "next-common/components/signerPopup/signerWithBalance";
import { useTransferAmount } from "next-common/components/popup/fields/useTransferAmount";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import EstimatedGas from "next-common/components/estimatedGas";
import { useContextApi } from "next-common/context/api";
import { useTxBuilder } from "next-common/hooks/useTxBuilder";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { isSameAddress } from "next-common/utils";
import useDotUsdBalance from "./useDotUsdBalance";
import { ReadOnlyAssetField } from "./swapPopupFields";

function PopupContent() {
  const { assetId, symbol, decimals } = usePopupParams();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const signerAddress = signerAccount?.realAddress;
  const dispatch = useDispatch();

  // The amount is capped by the balance of the account the transfer is actually sent from,
  // which changes here when the user picks another proxy or a multisig as the origin.
  const { transferrable, isLoading: isBalanceLoading } = useDotUsdBalance({
    address: signerAddress,
    assetId,
  });

  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({
    transferrable: transferrable?.toString(),
    decimals,
    symbol,
    isLoading: isBalanceLoading,
  });

  const { value: transferToAddress, component: transferToAddressField } =
    useAddressComboField({ title: "To" });

  const { getTxFuncForSubmit, getTxFuncForFee } = useTxBuilder(
    (toastError) => {
      // The transfer always targets Asset Hub; tell the user when this deployment is not
      // connected to it instead of failing on a missing pallet.
      if (!api?.tx?.assets?.transfer) {
        toastError("Asset Hub RPC is not connected yet");
        return;
      }

      if (isNil(assetId)) {
        toastError("The dotUSD asset is unknown");
        return;
      }

      if (!transferToAddress) {
        toastError("Please enter the recipient address");
        return;
      }

      if (isSameAddress(transferToAddress, signerAddress)) {
        toastError("Cannot transfer to self");
        return;
      }

      let amount;
      try {
        amount = getCheckedTransferAmount();
      } catch (e) {
        toastError(e.message);
        return;
      }

      return api.tx.assets.transfer(assetId, transferToAddress, amount);
    },
    [api, assetId, signerAddress, transferToAddress, getCheckedTransferAmount],
  );

  // The panel balance is a subscription, so it follows the transfer by itself.
  const onInBlock = useCallback(() => {
    dispatch(newSuccessToast("Transfer successfully"));
  }, [dispatch]);

  return (
    <>
      <SignerWithBalance api={api} />
      <ReadOnlyAssetField asset={{ index: assetId, symbol }} />
      {transferToAddressField}
      {transferAmountField}
      <AdvanceSettings>
        <EstimatedGas getTxFunc={getTxFuncForFee} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <TxSubmissionButton
          title="Confirm"
          getTxFunc={getTxFuncForSubmit}
          onInBlock={onInBlock}
        />
      </div>
    </>
  );
}

export default function DotUsdTransferPopup(props) {
  return (
    <PopupWithSigner title="Transfer dotUSD" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
