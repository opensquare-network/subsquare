import PopupWithSigner from "next-common/components/popupWithSigner";
import {
  useExtensionAccounts,
  usePopupParams,
  useSetSigner,
} from "next-common/components/popupWithSigner/context";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { isSameAddress } from "next-common/utils";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import PrimaryButton from "next-common/lib/button/primary";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import Signer from "next-common/components/popup/fields/signerField";
import { useUser } from "next-common/context/user";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useNativeTransferAmount from "next-common/components/assets/crossChainTransferPopup/useNativeTransferAmount";
import useCrossChainApi from "next-common/components/assets/crossChainTransferPopup/useCrossChainApi";
import { useSendTransaction } from "next-common/hooks/useSendTransaction";
import Chains from "next-common/utils/consts/chains";
import { ExistentialDeposit } from "next-common/components/assets/crossChainTransferPopup";
import dynamic from "next/dynamic";
import {
  Chain,
  getChainName,
} from "next-common/components/assets/crossChainTransferPopup/useCrossChainDirection";

const SystemCrosschain = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemCrosschain),
);

function CrosschainDirection({ sourceChain, destinationChain }) {
  return (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        chain={sourceChain}
        name={getChainName(sourceChain)}
      />
      <div className="flex w-[40px] h-[40px] justify-center items-center [&_svg_path]:fill-textPrimary">
        <SystemCrosschain width={24} height={24} />
      </div>
      <Chain
        title="Destination Chain"
        chain={destinationChain}
        name={getChainName(destinationChain)}
      />
    </div>
  );
}

function PopupContent() {
  const { onClose } = usePopupParams();
  const sourceChain = Chains.polkadot;
  const destinationChain = Chains.polkadotAssetHub;
  const { sourceApi, destinationApi, getTeleportTx } = useCrossChainApi({
    sourceChain,
    destinationChain,
  });
  const { sendTxFunc, isLoading: isSubmitting } = useSendTransaction();

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
    try {
      if (!transferToAddress) {
        throw new Error("Transfer to address is not specified");
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

    const account = extensionAccounts.find((item) =>
      isSameAddress(item.address, address),
    );
    setSigner(sourceApi, account);

    await sendTxFunc({
      api: sourceApi,
      tx,
      onSubmitted: onClose,
      onInBlock: () => {
        dispatch(newSuccessToast("Teleport successfully"));
      },
    });
  }, [
    sourceApi,
    dispatch,
    extensionAccounts,
    address,
    getTxFunc,
    setSigner,
    sendTxFunc,
    onClose,
  ]);

  return (
    <>
      <Signer title="Origin" />
      <CrosschainDirection
        sourceChain={sourceChain}
        destinationChain={destinationChain}
      />
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

export default function CrossChainTransferPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
