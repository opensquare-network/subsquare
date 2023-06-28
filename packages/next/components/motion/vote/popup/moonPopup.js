import { detailPageCategory } from "next-common/utils/consts/business/category";
import * as treasuryCouncil from "next-common/utils/moonPrecompiles/treasuryCouncil";
import * as moonCouncil from "next-common/utils/moonPrecompiles/council";
import * as techCommCouncil from "next-common/utils/moonPrecompiles/techCommCouncil";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import isUseMetamask from "next-common/utils/isUseMetamask";
import PopupWithAddress from "next-common/components/popupWithAddress";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { submitPolkadotExtrinsic } from ".";
import PopupContent from "./popupContent";

export async function submitMoonMetamaskExtrinsic({
  type,
  motionHash,
  motionIndex,
  approve,
  dispatch,
  setLoading,
  onInBlock,
  onSubmitted,
  onClose,
  signerAccount,
  isMounted,
}) {
  let callTo, callData;

  if (type === detailPageCategory.TREASURY_COUNCIL_MOTION) {
    ({ callTo, callData } = treasuryCouncil.encodeVoteData({
      proposalHash: motionHash,
      proposalIndex: motionIndex,
      approve,
    }));
  } else if (type === detailPageCategory.COUNCIL_MOTION) {
    ({ callTo, callData } = moonCouncil.encodeVoteData({
      proposalHash: motionHash,
      proposalIndex: motionIndex,
      approve,
    }));
  } else if (type === detailPageCategory.TECH_COMM_MOTION) {
    ({ callTo, callData } = techCommCouncil.encodeVoteData({
      proposalHash: motionHash,
      proposalIndex: motionIndex,
      approve,
    }));
  } else {
    return dispatch(newErrorToast(`Unsupported vote for motion type: ${type}`));
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

async function submitExtrinsic({
  api,
  chain,
  type,
  motionHash,
  motionIndex,
  approve,
  dispatch,
  setLoading,
  onFinalized,
  onInBlock,
  onSubmitted,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      chain,
      type,
      motionHash,
      motionIndex,
      approve,
      dispatch,
      setLoading,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
    });
  } else {
    await submitPolkadotExtrinsic({
      api,
      chain,
      type,
      motionHash,
      motionIndex,
      approve,
      dispatch,
      setLoading,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function Popup(props) {
  return (
    <PopupWithAddress
      title="Vote"
      Component={PopupContent}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
