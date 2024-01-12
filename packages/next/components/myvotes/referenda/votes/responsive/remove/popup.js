import SignerPopup from "next-common/components/signerPopup";
import React, { useCallback, useState } from "react";
import noop from "lodash.noop";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";

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
      let tx = api.tx.convictionVoting.removeVote(trackId, referendumIndex);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
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
