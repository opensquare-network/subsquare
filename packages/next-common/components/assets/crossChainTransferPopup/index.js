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
import BigNumber from "bignumber.js";
import { sendSubstrateTx } from "next-common/utils/sendTx";
import Signer from "next-common/components/popup/fields/signerField";
import { useUser } from "next-common/context/user";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useCrossChainDirection from "./useCrossChainDirection";
import useTransferAmount from "./useTransferAmount";
import { getTeleportParamsFromRelayChainToAssetHub } from "./teleportParams";

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
  const setSigner = useSetSigner();

  const user = useUser();
  const address = user?.address;
  const dispatch = useDispatch();
  const extensionAccounts = useExtensionAccounts();
  const { decimals } = useChainSettings();
  const { transferAmount, component: transferAmountField } = useTransferAmount({
    api: polkadotApi,
    transferFromAddress: address,
  });
  const { component: crossChainDirection } = useCrossChainDirection();
  const { value: transferToAddress, component: addressComboField } =
    useAddressComboField({ title: "To Address", defaultAddress: address });

  const getTxFunc = useCallback(() => {
    if (!polkadotApi) {
      return;
    }

    if (!transferAmount) {
      dispatch(newErrorToast("Please fill the amount"));
      return;
    }

    const amount = new BigNumber(transferAmount)
      .times(Math.pow(10, decimals))
      .toFixed();

    const params = getTeleportParamsFromRelayChainToAssetHub({
      api: polkadotApi,
      transferToAddress,
      amount,
    });
    return polkadotApi.tx.xcmPallet.limitedTeleportAssets(...params);
  }, [dispatch, polkadotApi, transferToAddress, transferAmount]);

  const isMounted = useMountedState();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const doSubmit = useCallback(async () => {
    if (!polkadotApi) {
      dispatch(newErrorToast("Chain network is not connected yet"));
      return;
    }

    if (!transferToAddress) {
      dispatch(newErrorToast("Transfer to address is not specified"));
      return;
    }

    let tx = await getTxFunc();
    if (!tx) {
      return;
    }

    const account = extensionAccounts.find((item) =>
      isSameAddress(item.address, address),
    );
    setSigner(polkadotApi, account);

    await sendSubstrateTx({
      api: polkadotApi,
      tx,
      dispatch,
      setLoading: setIsSubmitting,
      signerAddress: address,
      isMounted,
      onClose,
      onInBlock: () => {
        dispatch(newSuccessToast("Transfer successfully"));
      },
    });
  }, [polkadotApi, dispatch, extensionAccounts, address, getTxFunc, setSigner]);

  return (
    <>
      <Signer title="Origin" />
      {crossChainDirection}
      {addressComboField}
      {transferAmountField}
      <AdvanceSettings>
        <ExistentialDeposit destApi={api} />
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
