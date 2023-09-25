import PopupWithSigner from "next-common/components/popupWithSigner";
import AyeNayTab from "./ayeNayTab";
import useMoonStandardVote from "./voteHooks/useMoonStandardVote";
import useMoonSplitVote from "./voteHooks/useMoonSplitVote";
import PopupContent from "./popupContent";
import { submitPolkadotExtrinsic } from "./index";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";

async function submitMoonMetamaskExtrinsic({
  getVoteTx,
  dispatch,
  setLoading,
  onInBlock,
  onSubmitted,
  onClose,
  signerAccount,
  isMounted,
}) {
  let { callTo, callData } = getVoteTx() || {};
  if (!callTo || !callData) {
    return;
  }

  if (signerAccount?.proxyAddress) {
    ({ callTo, callData } = encodeProxyData({
      real: signerAccount?.proxyAddress,
      callTo,
      callData,
    }));
  }

  await sendEvmTx({
    to: callTo,
    data: callData,
    dispatch,
    setLoading,
    onInBlock,
    onSubmitted,
    onClose,
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

export async function submitExtrinsic({
  api,
  getVoteTx,
  dispatch,
  setLoading,
  onInBlock,
  onSubmitted,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      getVoteTx,
      dispatch,
      setLoading,
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
    });
  } else {
    await submitPolkadotExtrinsic({
      api,
      getVoteTx,
      dispatch,
      setLoading,
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function MoonPopup(props) {
  return (
    <PopupWithSigner
      title="Referendum vote"
      Component={PopupContent}
      useStandardVote={useMoonStandardVote}
      useSplitVote={useMoonSplitVote}
      VoteTypeTab={AyeNayTab}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
