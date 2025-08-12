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
import { useSubBalanceInfo } from "next-common/hooks/balance/useSubBalanceInfo";
import useQueryExistentialDeposit from "next-common/utils/hooks/chain/useQueryExistentialDeposit";
import BigNumber from "bignumber.js";

function PopupContent() {
  const { asset } = usePopupParams();
  const api = useContextApi();
  const signerAccount = useSignerAccount();
  const address = signerAccount?.realAddress;
  const dispatch = useDispatch();

  const { value: nativeBalance } = useSubBalanceInfo(address);
  const existentialDeposit = useQueryExistentialDeposit();

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

    try {
      const tx = api.tx.foreignAssets.transfer(
        asset.location,
        transferToAddress,
        amount,
      );

      const paymentInfo = await tx.paymentInfo(address);
      const estimatedFee = paymentInfo.partialFee.toBigInt();
      const totalRequired = new BigNumber(estimatedFee.toString()).plus(
        existentialDeposit || 0,
      );

      if (nativeBalance && existentialDeposit) {
        const { transferrable } = nativeBalance;

        if (new BigNumber(transferrable).lt(totalRequired)) {
          dispatch(
            newErrorToast(
              "Insufficient native token balance for transaction fees.",
            ),
          );
          return;
        }
      }

      return tx;
    } catch (error) {
      dispatch(newErrorToast("Failed to estimate transaction fee"));
      return;
    }
  }, [
    dispatch,
    api,
    asset,
    address,
    transferToAddress,
    getCheckedTransferAmount,
    nativeBalance,
    existentialDeposit,
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
