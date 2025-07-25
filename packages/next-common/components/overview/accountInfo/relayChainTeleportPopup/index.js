import PopupWithSigner from "next-common/components/popupWithSigner";
import { useCallback, useState } from "react";
import { useDispatch } from "react-redux";
import {
  newErrorToast,
  newSuccessToast,
} from "next-common/store/reducers/toastSlice";
import AdvanceSettings from "next-common/components/summary/newProposalQuickStart/common/advanceSettings";
import Signer from "next-common/components/popup/fields/signerField";
import { useSignerAccount } from "next-common/components/popupWithSigner/context";
import useAddressComboField from "next-common/components/preImages/createPreimagePopup/fields/useAddressComboField";
import useNativeTransferAmount from "next-common/components/assets/paraChainTeleportPopup/useNativeTransferAmount";
import {
  useChainApi,
  useGetTeleportTxFunc,
} from "next-common/components/assets/paraChainTeleportPopup/crossChainApi";
import ExistentialDeposit from "next-common/components/popup/fields/existentialDepositField";
import dynamic from "next/dynamic";
import { Chain } from "next-common/components/assets/paraChainTeleportPopup/useCrossChainDirection";
import TxSubmissionButton from "next-common/components/common/tx/txSubmissionButton";
import ChainIcon from "next-common/components/header/chainIcon";
import getChainSettings from "next-common/utils/consts/settings";
import { useChain } from "next-common/context/chain";
import { useAssetHubChain } from "next-common/hooks/useAssetHubChain";
import Chains from "next-common/utils/consts/chains";

const SystemCrosschain = dynamic(
  import("@osn/icons/subsquare").then((mod) => mod.SystemCrosschain),
);

function buildChainOption(chain) {
  const { name } = getChainSettings(chain);

  return {
    icon: <ChainIcon chain={chain} />,
    label: name,
    value: chain,
  };
}

function useSourceChainOptions() {
  const chain = useChain();
  return [buildChainOption(chain)];
}

function useDestinationChainOptions() {
  const chain = useChain();
  const assetHubChain = useAssetHubChain();
  const options = [buildChainOption(assetHubChain)];
  if (chain === Chains.polkadot) {
    options.push(buildChainOption(Chains.collectives));
  }
  return options;
}

function CrosschainDirection({
  sourceChain,
  destinationChain,
  setDestinationChain,
}) {
  const sourceChainOptions = useSourceChainOptions();
  const destinationChainOptions = useDestinationChainOptions();
  return (
    <div className="flex items-end gap-[12px]">
      <Chain
        title="Source Chain"
        value={sourceChain}
        className="!text-textPrimary"
        disabled
        readOnly
        options={sourceChainOptions}
      />
      <div className="flex w-[40px] h-[40px] justify-center items-center [&_svg_path]:fill-textPrimary">
        <SystemCrosschain width={24} height={24} />
      </div>
      <Chain
        title="Destination Chain"
        value={destinationChain}
        options={destinationChainOptions}
        onChange={(item) => {
          setDestinationChain(item.value);
        }}
      />
    </div>
  );
}

function PopupContent() {
  const sourceChain = useChain();
  const sourceApi = useChainApi(sourceChain);

  const assetHubChain = useAssetHubChain();
  const [destinationChain, setDestinationChain] = useState(assetHubChain);

  const destinationApi = useChainApi(destinationChain);

  const getTeleportTx = useGetTeleportTxFunc({
    sourceApi,
    sourceChain,
    destinationChain,
  });
  const signerAccount = useSignerAccount();
  const dispatch = useDispatch();
  const {
    getCheckedValue: getCheckedTransferAmount,
    component: transferAmountField,
  } = useNativeTransferAmount({
    api: sourceApi,
    transferFromAddress: signerAccount?.realAddress,
  });
  const { value: transferToAddress, component: addressComboField } =
    useAddressComboField({
      title: "To Address",
      defaultAddress: signerAccount?.realAddress,
    });

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
      <Signer />
      <CrosschainDirection
        sourceChain={sourceChain}
        destinationChain={destinationChain}
        setDestinationChain={setDestinationChain}
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
    <PopupWithSigner title="Cross-chain" {...props}>
      <PopupContent />
    </PopupWithSigner>
  );
}
