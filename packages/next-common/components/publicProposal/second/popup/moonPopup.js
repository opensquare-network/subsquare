import PopupWithSigner from "next-common/components/popupWithSigner";
import PopupContent from "./popupContent";
import isUseMetamask from "next-common/utils/isUseMetamask";
import { submitSubstrateExtrinsic } from ".";
import { sendEvmTx } from "next-common/utils/sendEvmTx";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";
import { encodeSecondData } from "next-common/utils/moonPrecompiles/democracy";

async function submitMoonMetamaskExtrinsic({
  proposalIndex,
  depositorUpperBound,
  times,
  dispatch,
  setLoading,
  onInBlock,
  onClose,
  signerAccount,
  isMounted,
}) {
  let { callTo, callData } = encodeSecondData({
    propIndex: parseInt(proposalIndex),
    secondsUpperBound: parseInt(depositorUpperBound) || 1,
  });

  if (times > 1) {
    let toParam = [],
      valueParam = [],
      callDataParam = [],
      gasLimitParam = [];

    for (let n = 0; n < times; n++) {
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
    signerAccount,
    isMounted,
  });
}

async function submitExtrinsic({
  api,
  proposalIndex,
  depositorUpperBound,
  times,
  dispatch,
  setLoading,
  onSubmitted,
  onInBlock,
  onFinalized,
  onClose,
  signerAccount,
  isMounted,
}) {
  if (isUseMetamask()) {
    await submitMoonMetamaskExtrinsic({
      proposalIndex,
      depositorUpperBound,
      times,
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
      proposalIndex,
      depositorUpperBound,
      times,
      dispatch,
      setLoading,
      onSubmitted,
      onInBlock,
      onFinalized,
      onClose,
      signerAccount,
      isMounted,
    });
  }
}

export default function MoonSecondPopup(props) {
  return (
    <PopupWithSigner
      title="Delegate"
      Component={PopupContent}
      submitExtrinsic={submitExtrinsic}
      {...props}
    />
  );
}
