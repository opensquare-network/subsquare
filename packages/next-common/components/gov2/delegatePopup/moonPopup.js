import { emptyFunction } from "next-common/utils";
import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { submitSubstrateExtrinsic } from ".";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";
import { encodeDelegateData } from "next-common/utils/moonPrecompiles/convictionVoting";

async function submitMoonMetamaskExtrinsic({
  trackIds,
  conviction,
  bnVoteBalance,
  targetAddress,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  let { callTo, callData } = encodeDelegateData({
    trackId: parseInt(trackIds[0]),
    targetAddress,
    conviction: parseInt(conviction),
    amount: BigInt(bnVoteBalance.toString()),
  });

  if (trackIds.length > 1) {
    let toParam = [],
      valueParam = [],
      callDataParam = [],
      gasLimitParam = [];

    toParam.push(callTo);
    callDataParam.push(callData);

    for (let n = 1; n < trackIds.length; n++) {
      let { callTo, callData } = encodeDelegateData({
        trackId: parseInt(trackIds[n]),
        targetAddress,
        conviction: parseInt(conviction),
        amount: BigInt(bnVoteBalance.toString()),
      });

      toParam.push(callTo);
      callDataParam.push(callData);
    }

    ({ callTo, callData } = encodeBatchAllData({
      to: toParam,
      value: valueParam,
      callData: callDataParam,
      gasLimit: gasLimitParam,
    }));
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
    onClose,
    signerAddress: signerAccount?.address,
    isMounted,
  });
}

async function submitExtrinsic({
  api,
  trackIds,
  conviction,
  bnVoteBalance,
  targetAddress,
  dispatch,
  setLoading,
  onInBlock = emptyFunction,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      trackIds,
      conviction,
      bnVoteBalance,
      targetAddress,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  } else {
    await submitSubstrateExtrinsic({
      api,
      trackIds,
      conviction,
      bnVoteBalance,
      targetAddress,
      dispatch,
      setLoading,
      onInBlock,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function MoonDelegatePopup(props) {
  return (
    <PopupWithSigner
      title="Delegate"
      Component={PopupContent}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
