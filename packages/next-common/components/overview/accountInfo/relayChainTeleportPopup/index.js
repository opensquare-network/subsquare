import PopupWithSigner from "next-common/components/popupWithSigner";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import Signer from "next-common/components/popup/fields/signerField";
import { useUser } from "next-common/context/user";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useNativeTransferAmount from "next-common/components/assets/paraChainTeleportPopup/useNativeTransferAmount";
import {
  useChainApi,
  useGetTeleportTxFunc,
} from "next-common/components/assets/paraChainTeleportPopup/crossChainApi";
import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import dynamic from "next/dynamic";
import {
  Chain,
  getChainName,
} from "next-common/components/assets/paraChainTeleportPopup/useCrossChainDirection";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import { useChain } from "next-common/context/chain";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";

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
  const sourceChain = useChain();
  const sourceApi = useChainApi(sourceChain);

  const destinationChain = useAssetHubChain();
  const destinationApi = useChainApi(destinationChain);

  const getTeleportTx = useGetTeleportTxFunc({
    sourceApi,
    sourceChain,
    destinationChain,
  });
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
      <TxSubmissionButton
        getTxFunc={getTxFunc}
        onInBlock={() => {
          dispatch(newSuccessToast("Teleport successfully"));
        }}
      />
    </>
  );
}

export default function RelayChainTeleportPopup(props) {
  return (
    <PopupWithSigner title="Cross-chain" className="!w-[640px]" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
