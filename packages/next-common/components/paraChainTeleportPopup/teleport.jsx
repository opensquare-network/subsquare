import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import ConnectedUserOrigin from "next-common/components/popup/fields/connectedUserOriginField";
import PopupWithSigner from "next-common/components/popupWithSigner";
import { usePopupParams } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { useUser } from "next-common/context/user";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import SubmitButton from "next-common/components/common/tx/submitButton";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useChainApi, useGetTeleportTxFunc } from "./crossChainApi";
import useCrossChainTeleport from "./useCrossChainTeleport";
import useNativeTransferAmount from "./useNativeTransferAmount";
import PeopleApiProvider from "next-common/context/people/api";
import CoretimeApiProvider from "next-common/context/coretime/api";
import { CollectivesApiProvider } from "next-common/context/collectives/api";

function PopupContent() {
  const { onClose } = usePopupParams();
  const {
    sourceChain,
    destinationChain,
    component: crossChainTeleport,
  } = useCrossChainTeleport();
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
    if (!transferToAddress) {
      throw new Error("Destination address is required");
    }

    const amount = getCheckedTransferAmount();

    return getTeleportTx(transferToAddress, amount);
  }, [getTeleportTx, transferToAddress, getCheckedTransferAmount]);

  const doSubmit = useCallback(async () => {
    if (!sourceApi) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    try {
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
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [sourceApi, dispatch, getTxFunc, sendTxFunc, onClose]);

  const submitDisabled = useMemo(() => {
    return sourceChain === destinationChain;
  }, [sourceChain, destinationChain]);

  return (
    <>
      <ConnectedUserOrigin />
      {crossChainTeleport}
      {addressComboField}
      {transferAmountField}
      <AdvanceSettings>
        <ExistentialDeposit destApi={destinationApi} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <SubmitButton
          tooltip={
            submitDisabled
              ? "Source and destination should be different chains"
              : undefined
          }
          loading={isSubmitting}
          onClick={doSubmit}
          disabled={submitDisabled}
        >
          Submit
        </SubmitButton>
      </div>
    </>
  );
}

export default function ParaChainTeleportPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" {...props}>
      <PeopleApiProvider>
        <CoretimeApiProvider>
          <CollectivesApiProvider>
            <PopupContent />
          </CollectivesApiProvider>
        </CoretimeApiProvider>
      </PeopleApiProvider>
    </PopupWithSigner>
  );
}
