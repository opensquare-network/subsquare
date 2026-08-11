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
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { InfoMessage } from "next-common/components/setting/styled";
import { isHydrationChain } from "next-common/utils/chain";
import { useChainApi, useGetHydrationCrossChainTx } from "./crossChainApi";
import useHydrationCrossChainDirection, {
  getChainName,
} from "./useHydrationCrossChainDirection";
import useTransferAmount, {
  DOT_SYMBOL,
  DOT_DECIMALS,
  HYDRATION_DOT_ASSET_ID,
} from "./useTransferAmount";

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
  // The destination ED of the transferred asset (DOT) depends on the
  // destination chain:
  // - Hydration: DOT is a foreign asset; its per-asset ED comes from the
  //   assetRegistry pallet (async query).
  // - Asset Hub: DOT is the native token; its ED is the balances pallet's.
  const [dotED, setDotED] = useState(null);
  const [isDotEDLoading, setIsDotEDLoading] = useState(true);
  useEffect(() => {
    if (!destinationApi) {
      setDotED(null);
      setIsDotEDLoading(true);
      return;
    }

    if (isHydrationDest) {
      setIsDotEDLoading(true);
      destinationApi.query.assetRegistry
        ?.assets(HYDRATION_DOT_ASSET_ID)
        .then((res) => {
          // assets() returns an Option; the field is only reachable after
          // unwrapping it.
          const ed = res?.isSome ? res.unwrap().existentialDeposit : null;
          setDotED(ed?.toJSON?.() ?? ed?.toString?.() ?? null);
        })
        .catch(() => setDotED(null))
        .finally(() => setIsDotEDLoading(false));
    } else {
      setDotED(
        destinationApi.consts.balances?.existentialDeposit?.toJSON?.() ?? null,
      );
      setIsDotEDLoading(false);
    }
  }, [isHydrationDest, destinationApi]);

  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useTransferAmount({
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
        {/* The transferred asset is always DOT; its destination ED is computed
        per destination chain in the dotED effect above. */}
        <ExistentialDepositValue
          value={dotED}
          symbol={DOT_SYMBOL}
          decimals={DOT_DECIMALS}
          loading={isDotEDLoading}
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
