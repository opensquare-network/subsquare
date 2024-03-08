import SignerPopup from "next-common/components/signerPopup";
import React, { useCallback, useState } from "react";
import { noop } from "lodash-es";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { encodeRemoveVoteForTrackData } from "next-common/utils/moonPrecompiles/convictionVoting";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";

export default function ReferendumRemovalPopup({
  vote,
  onClose = noop,
  onInBlock = noop,
}) {
  const dispatch = useDispatch();
  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

  const doRemoveVote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain RPC is not connected yet");
      }

      const { trackId, referendumIndex } = vote || {};

      let { callTo, callData } = encodeRemoveVoteForTrackData({
        trackId,
        pollIndex: referendumIndex,
      });

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
        setLoading: setIsLoading,
        onInBlock,
        onClose,
        signerAccount,
        isMounted,
      });
    },
    [dispatch, isMounted, showErrorToast, onInBlock, onClose, vote],
  );

  return (
    <SignerPopup
      title="Remove Vote"
      actionCallback={doRemoveVote}
      onClose={onClose}
      isLoading={isLoading}
    >
      <RelatedReferenda relatedReferenda={[vote?.referendumIndex]} />
    </SignerPopup>
  );
}
