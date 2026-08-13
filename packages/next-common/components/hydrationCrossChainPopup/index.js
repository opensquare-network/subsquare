import ExistentialDepositValue from "next-common/components/popup/fields/existentialDepositValue";
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
import { useChainApi, useGetHydrationCrossChainTx } from "./crossChainApi";
import CrossChainFeeSummary from "./crossChainFeeSummary";
import useDestinationExistentialDeposit from "./useDestinationExistentialDeposit";
import useHydrationCrossChainDirection from "./useHydrationCrossChainDirection";
import useHydrationCrossChainFees from "./useHydrationCrossChainFees";
import useTransferAmount from "./useTransferAmount";
import { getTransferAsset } from "./transferAssets";

function PopupContent() {
  const { onClose } = usePopupParams();
  const {
    sourceChain,
    destinationChain,
    component: crossChainDirection,
  } = useHydrationCrossChainDirection();
  const sourceApi = useChainApi(sourceChain);
  const destinationApi = useChainApi(destinationChain);
  const getTeleportTx = useGetHydrationCrossChainTx({
    sourceApi,
    sourceChain,
    destinationChain,
  });
  const { sendTxFunc, isSubmitting } = useSendTransaction();

  const user = useUser();
  const address = user?.address;
  const dispatch = useDispatch();

  const {
    symbol,
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({
    sourceChain,
    api: sourceApi,
    transferFromAddress: address,
  });
  const { value: transferToAddress, component: addressComboField } =
    useAddressComboField({ title: "To Address", defaultAddress: address });

  const { value: destED, isLoading: isDestEDLoading } =
    useDestinationExistentialDeposit({
      destinationApi,
      destinationChain,
      symbol,
    });

  const {
    sourceFee,
    destinationFee,
    isLoading: isFeesLoading,
  } = useHydrationCrossChainFees({
    sourceApi,
    destinationApi,
    sourceChain,
    destinationChain,
    symbol,
    address,
    transferToAddress,
  });

  const getTxFunc = useCallback(() => {
    if (!transferToAddress) {
      throw new Error("Destination address is required");
    }

    const amount = getCheckedTransferAmount();

    return getTeleportTx(transferToAddress, amount, symbol);
  }, [getTeleportTx, transferToAddress, getCheckedTransferAmount, symbol]);

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
          dispatch(newSuccessToast("Cross-chain transfer successfully"));
        },
      });
    } catch (e) {
      dispatch(newErrorToast(e.message));
    }
  }, [sourceApi, dispatch, getTxFunc, sendTxFunc, onClose]);

  return (
    <>
      <ConnectedUserOrigin />
      {crossChainDirection}
      {addressComboField}
      {transferAmountField}
      {/* Source chain fee (execution + delivery on the origin chain) and
      destination chain fee (execution on the target chain). */}
      <CrossChainFeeSummary
        sourceFee={sourceFee}
        destinationFee={destinationFee}
        isLoading={isFeesLoading}
      />
      <AdvanceSettings>
        {/* The destination ED is computed per selected symbol and destination
        chain in the destED effect above. */}
        <ExistentialDepositValue
          value={destED}
          symbol={symbol}
          decimals={getTransferAsset(symbol).decimals}
          loading={isDestEDLoading}
        />
      </AdvanceSettings>
      <div className="flex justify-end">
        <PrimaryButton loading={isSubmitting} onClick={doSubmit}>
          Submit
        </PrimaryButton>
      </div>
    </>
  );
}

export default function HydrationCrossChainPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
