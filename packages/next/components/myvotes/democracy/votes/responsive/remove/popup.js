import { noop } from "lodash-es";
import { useDispatch } from "react-redux";
import React, { useCallback, useState } from "react";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { useMountedState } from "react-use";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";

export default function ReferendumRemovalPopup({
  referendumIndex,
  onClose = noop,
}) {
  const dispatch = useDispatch();
  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const doRemoveVote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        showErrorToast("Chain RPC is not connected yet");
        return;
      }

      let tx = api.tx.democracy.removeVote(referendumIndex);
      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
        onClose,
        signerAccount,
        isMounted,
      });
    },
    [dispatch, isMounted, showErrorToast, onClose, referendumIndex],
  );

  return (
    <SignerPopup
      title="Remove Vote"
      actionCallback={doRemoveVote}
      onClose={onClose}
      isLoading={isLoading}
    >
      <RelatedReferenda relatedReferenda={[referendumIndex]} />
    </SignerPopup>
  );
}
