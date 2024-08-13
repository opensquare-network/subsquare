import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  usePopupParams,
  useSetSigner,
} from "next-common/components/popupWithSigner/context";
import { useCallback, useState } from "react";
import Input from "next-common/components/input";
import PopupLabel from "next-common/components/popup/label";
import { useDispatch } from "react-redux";
import { useContextApi } from "next-common/context/api";
import { isSameAddress, toPrecision } from "next-common/utils";
import { usePolkadotApi } from "next-common/context/polkadotApi";
import { useChainSettings } from "next-common/context/chain";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import { useMountedState } from "react-use";
import PrimaryButton from "next-common/lib/button/primary";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import { sendSubstrateTx } from "next-common/utils/sendTx";
import Signer from "next-common/components/popup/fields/signerField";
import { useUser } from "next-common/context/user";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useCrossChainDirection from "./useCrossChainDirection";
import useNativeTransferAmount from "./useNativeTransferAmount";
import Chains from "next-common/utils/consts/chains";
import teleportFromRelayChainToAssetHub from "./teleportFromRelayChainToAssetHub";
import teleportFromAssetHubToRelayChain from "./teleportFromAssetHubToRelayChain";

function ExistentialDeposit({ destApi }) {
  const { decimals } = useChainSettings();
  return (
    <div>
      <PopupLabel text="Destination Existential Deposit" />
      <Input
        disabled
        value={toPrecision(
          destApi?.consts.balances?.existentialDeposit || 0,
          decimals,
        )}
        symbol="DOT"
      />
    </div>
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const api = useContextApi();
  const polkadotApi = usePolkadotApi();
  const {
    sourceChain,
    destinationChain,
    component: crossChainDirection,
  } = useCrossChainDirection();

  let sourceApi = null;
  if (sourceChain === Chains.polkadot) {
    sourceApi = polkadotApi;
  } else if (sourceChain === Chains.polkadotAssetHub) {
    sourceApi = api;
  }

  let destApi = null;
  if (destinationChain === Chains.polkadot) {
    destApi = polkadotApi;
  } else if (destinationChain === Chains.polkadotAssetHub) {
    destApi = api;
  }

  const setSigner = useSetSigner();

  const user = useUser();
  const address = user?.address;
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
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
    if (!sourceApi) {
      return;
    }

    let amount;
    try {
      amount = getCheckedTransferAmount();
    } catch (e) {
      dispatch(newErrorToast(e.message));
      return;
    }

    if (
      sourceChain === Chains.polkadot &&
      destinationChain === Chains.polkadotAssetHub
    ) {
      return teleportFromRelayChainToAssetHub({
        sourceApi,
        transferToAddress,
        amount,
      });
    } else if (
      sourceChain === Chains.polkadotAssetHub &&
      destinationChain === Chains.polkadot
    ) {
      return teleportFromAssetHubToRelayChain({
        sourceApi,
        transferToAddress,
        amount,
      });
    }
  }, [dispatch, sourceApi, transferToAddress, getCheckedTransferAmount]);

  const isMounted = useMountedState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doSubmit = useCallback(async () => {
    if (!sourceApi) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!transferToAddress) {
      dispatch(newErrorToast("Transfer to address is not specified"));
      return;
    }

    const tx = await getTxFunc();
    if (!tx) {
      return;
    }

    const account = extensionAccounts.find((item) =>
      isSameAddress(item.address, address),
    );
    setSigner(sourceApi, account);

    await sendSubstrateTx({
      api: sourceApi,
      tx,
      dispatch,
      setLoading: setIsSubmitting,
      signerAddress: address,
      isMounted,
      onClose,
      onInBlock: () => {
        dispatch(newSuccessToast("Teleport successfully"));
      },
    });
  }, [sourceApi, dispatch, extensionAccounts, address, getTxFunc, setSigner]);

  return (
    <>
      <Signer title="Origin" />
      {crossChainDirection}
      {addressComboField}
      {transferAmountField}
      <AdvanceSettings>
        <ExistentialDeposit destApi={destApi} />
      </AdvanceSettings>
      <div className="flex justify-end">
        <PrimaryButton loading={isSubmitting} onClick={doSubmit}>
          Submit
        </PrimaryButton>
      </div>
    </>
  );
}

export function CrossChainTransferPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
