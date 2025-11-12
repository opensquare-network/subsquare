import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import ConnectedUserOrigin from "next-common/components/popup/fields/connectedUserOriginField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useUser } from "next-common/context/user";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import PrimaryButton from "next-common/lib/button/primary";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useChainApi, useGetTeleportTxFunc } from "./crossChainApi";
import useCrossChainDirection from "./useCrossChainDirection";
import useNativeTransferAmount from "./useNativeTransferAmount";

function PopupContent() {
  const { onClose } = usePopupParams();
  const {
    sourceChain,
    destinationChain,
    component: crossChainDirection,
  } = useCrossChainDirection();
  const sourceApi = useChainApi(sourceChain);
  const destinationApi = useChainApi(destinationChain);
  const getTeleportTx = useGetTeleportTxFunc({
    sourceApi,
    sourceChain,
    destinationChain,
  });
  const { sendTxFunc, isSubmitting } = useSendTransaction();

  const user = useUser();
  const address = user?.address;
  const dispatch = useDispatch();
  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useNativeTransferAmount({
    api: sourceApi,
    transferFromAddress: address,
  });
  const { value: transferToAddress, component: addressComboField } =
    useAddressComboField({ title: "To Address", defaultAddress: address });

  const getTxFunc = useCallback(() => {
    try {
      if (!transferToAddress) {
        throw new Error("Destination address is required");
      }

      const amount = getCheckedTransferAmount();

      return getTeleportTx(transferToAddress, amount);
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [dispatch, getTeleportTx, transferToAddress, getCheckedTransferAmount]);

  const doSubmit = useCallback(async () => {
    if (!sourceApi) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    const tx = getTxFunc();
    if (!tx) {
      return;
    }

    await sendTxFunc({
      api: sourceApi,
      tx,
      onSubmitted: onClose,
      onInBlock: () => {
        dispatch(newSuccessToast("Teleport successfully"));
      },
    });
  }, [sourceApi, dispatch, getTxFunc, sendTxFunc, onClose]);

  return (
    <>
      <ConnectedUserOrigin />
      {crossChainDirection}
      {addressComboField}
      {transferAmountField}
      <AdvanceSettings>
        <ExistentialDeposit destApi={destinationApi} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <PrimaryButton loading={isSubmitting} onClick={doSubmit}>
          Submit
        </PrimaryButton>
      </div>
    </>
  );
}

export default function ParaChainTeleportPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
