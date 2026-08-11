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
import { InfoMessage } from "next-common/components/setting/styled";
import { isHydrationChain } from "next-common/utils/chain";
import { useChainApi, useGetHydrationCrossChainTx } from "./crossChainApi";
import useHydrationCrossChainDirection, {
  getChainName,
} from "./useHydrationCrossChainDirection";
import useHydrationTransferAmount, {
  DOT_SYMBOL,
  DOT_DECIMALS,
  HYDRATION_DOT_ASSET_ID,
} from "./useHydrationTransferAmount";

function PopupContent() {
  const { onClose } = usePopupParams();
  const {
    sourceChain,
    destinationChain,
    isEvmSigner,
    component: crossChainDirection,
  } = useHydrationCrossChainDirection();
  const isHydrationDest = isHydrationChain(destinationChain);
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

  // DOT is a foreign asset on Hydration; its existential deposit is exposed per
  // asset by the assetRegistry pallet (not by a balances/tokens constant).
  const [hydrationDotED, setHydrationDotED] = useState(null);
  const [isHydrationDotEDLoading, setIsHydrationDotEDLoading] = useState(false);
  useEffect(() => {
    if (isHydrationDest && destinationApi) {
      setIsHydrationDotEDLoading(true);
      destinationApi.query.assetRegistry
        ?.assets(HYDRATION_DOT_ASSET_ID)
        .then((res) => {
          // assets() returns an Option; the field is only reachable after
          // unwrapping it.
          const ed = res?.isSome ? res.unwrap().existentialDeposit : null;
          setHydrationDotED(ed?.toJSON?.() ?? ed?.toString?.() ?? null);
        })
        .catch(() => setHydrationDotED(null))
        .finally(() => setIsHydrationDotEDLoading(false));
    } else {
      setHydrationDotED(null);
      setIsHydrationDotEDLoading(false);
    }
  }, [isHydrationDest, destinationApi]);

  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useHydrationTransferAmount({
    sourceChain,
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
        {/* DOT is a foreign asset on Hydration, so its destination deposit is the
        assetRegistry's per-asset value (and its own decimals), not the native
        HDX one. */}
        {isHydrationDest ? (
          <ExistentialDeposit
            destApi={destinationApi}
            value={hydrationDotED}
            symbol={DOT_SYMBOL}
            decimals={DOT_DECIMALS}
            loading={isHydrationDotEDLoading}
          />
        ) : (
          <ExistentialDeposit destApi={destinationApi} />
        )}
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
