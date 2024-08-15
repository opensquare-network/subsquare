import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import RelatedReferenda from "../popupCommon/relatedReferenda";

export default function ClearExpiredDemocracyVotePopup({ votes, onClose }) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const relatedReferenda = useMemo(() => {
    const referenda = [...new Set(votes)];
    referenda.sort((a, b) => a - b);
    return referenda;
  }, [votes]);

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doClearExpiredVote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        showErrorToast("Chain network is not connected yet");
        return;
      }

      if (!signerAccount) {
        showErrorToast("Please login first");
        return;
      }

      const realAddress = signerAccount.proxyAddress || signerAccount.address;

      let tx;

      const txsRemoveVote = relatedReferenda.map((referendumIndex) =>
        api.tx.democracy.removeVote(referendumIndex),
      );
      const txUnlock = api.tx.democracy.unlock(realAddress);
      const allTx = [...txsRemoveVote, txUnlock];
      if (allTx.length > 1) {
        tx = api.tx.utility.batch([...txsRemoveVote, txUnlock]);
      } else {
        tx = allTx[0];
      }

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
    [dispatch, isMounted, showErrorToast, onClose, relatedReferenda],
  );

  const title = relatedReferenda.length <= 0 ? "Unlock" : "Clear Expired Votes";
  return (
    <SignerPopup
      title={title}
      actionCallback={doClearExpiredVote}
      onClose={onClose}
      isLoading={isLoading}
    >
      <RelatedReferenda relatedReferenda={relatedReferenda} />
    </SignerPopup>
  );
}
