import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import PopupLabel from "next-common/components/popup/label";

function ExtraInfo({ votes }) {
  const relatedReferenda = Array.from(
    new Set((votes || []).map(({ referendumIndex }) => referendumIndex)),
  );
  relatedReferenda.sort((a, b) => a - b);

  return (
    <div>
      <PopupLabel text="Related referenda" />
      <div className="text-[12px] font-medium text-textPrimary">
        {relatedReferenda.length ? (
          relatedReferenda
            .map((referendumIndex) => `#${referendumIndex}`)
            .join(", ")
        ) : (
          <span className="text-textTertiary">None</span>
        )}
      </div>
    </div>
  );
}

export default function RemoveDemocracyVotePopup({
  votes,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doRemoveVote = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      const signerAddress = signerAccount.address;

      let tx;

      if (votes?.length === 1) {
        const { referendumIndex } = votes[0];
        tx = api.tx.democracy.removeVote(referendumIndex);
      } else if (votes?.length > 1) {
        const txs = votes.map(({ referendumIndex }) =>
          api.tx.democracy.removeVote(referendumIndex),
        );
        tx = api.tx.utility.batch(txs);
      } else {
        return showErrorToast("No votes selected");
      }

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
        onInBlock,
        onSubmitted,
        onClose,
        signerAddress,
        isMounted,
      });
    },
    [
      dispatch,
      isMounted,
      showErrorToast,
      onInBlock,
      onSubmitted,
      onClose,
      votes,
      setIsLoading,
    ],
  );

  return (
    <SignerPopup
      title="Remove Vote"
      actionCallback={doRemoveVote}
      onClose={onClose}
      isLoading={isLoading}
      extraContent={<ExtraInfo votes={votes} />}
    />
  );
}
