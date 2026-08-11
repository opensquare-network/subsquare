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
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useChainApi, useGetTeleportTxFunc } from "./crossChainApi";
import useCrossChainDirection from "./useCrossChainDirection";
import useTeleportTransferAmount, {
  DOT_SYMBOL,
  DOT_DECIMALS,
  HYDRATION_DOT_ASSET_ID,
} from "./useTeleportTransferAmount";
import PeopleApiProvider from "next-common/context/people/api";
import CoretimeApiProvider from "next-common/context/coretime/api";
import { InfoMessage } from "next-common/components/setting/styled";
import { getChainName } from "./useCrossChainDirection";
import { isHydrationChain } from "next-common/utils/chain";

function PopupContent() {
  const { onClose } = usePopupParams();
  const {
    sourceChain,
    destinationChain,
    isEvmSigner,
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

  // DOT is a foreign asset on HydraDX; its existential deposit is exposed per
  // asset by the assetRegistry pallet (not by a balances/tokens constant).
  const [hydrationDotED, setHydrationDotED] = useState(null);
  useEffect(() => {
    if (isHydrationChain(destinationChain) && destinationApi) {
      destinationApi.query.assetRegistry
        ?.assets(HYDRATION_DOT_ASSET_ID)
        .then((res) => {
          const ed = res?.existentialDeposit;
          setHydrationDotED(ed?.toJSON?.() ?? ed?.toString?.() ?? null);
        })
        .catch(() => setHydrationDotED(null));
    } else {
      setHydrationDotED(null);
    }
  }, [destinationChain, destinationApi]);

  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTeleportTransferAmount({
    sourceChain,
    destinationChain,
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

  return (
    <>
      {isEvmSigner && (
        <InfoMessage>
          The direction is locked to {getChainName(sourceChain)} →{" "}
          {getChainName(destinationChain)} for MetaMask.
        </InfoMessage>
      )}
      <ConnectedUserOrigin />
      {crossChainDirection}
      {addressComboField}
      {transferAmountField}
      <AdvanceSettings>
        {/* DOT is a foreign asset on HydraDX, so its destination deposit is the
        assetRegistry's per-asset value (and its own decimals), not the native
        HDX one. */}
        <ExistentialDeposit
          destApi={destinationApi}
          value={
            isHydrationChain(destinationChain) ? hydrationDotED : undefined
          }
          symbol={isHydrationChain(destinationChain) ? DOT_SYMBOL : undefined}
          decimals={
            isHydrationChain(destinationChain) ? DOT_DECIMALS : undefined
          }
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

export default function ParaChainTeleportPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" {...props}>
      <PeopleApiProvider>
        <CoretimeApiProvider>
          <PopupContent />
        </CoretimeApiProvider>
      </PeopleApiProvider>
    </PopupWithSigner>
  );
}
