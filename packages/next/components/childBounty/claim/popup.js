import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import fetchAndUpdatePost from "next-common/context/post/update";
import useWaitSyncBlock from "next-common/utils/hooks/useWaitSyncBlock";
import { usePostDispatch } from "next-common/context/post";
import { useDetailType } from "next-common/context/page";

export default function ClaimPopup({ childBounty, onClose }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const postDispatch = usePostDispatch();
  const type = useDetailType();
  const [isLoading, setIsLoading] = useState(false);

  const refreshPageData = useCallback(async () => {
    fetchAndUpdatePost(
      postDispatch,
      type,
      `${childBounty?.parentBountyId}_${childBounty?.index}`,
    );
  }, [childBounty, type, postDispatch]);

  const onClaimFinalized = useWaitSyncBlock(
    "Child bounty claimed",
    refreshPageData,
  );

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    [dispatch],
  );

  const doClaim = useCallback(
    async (api, signerAccount) => {
      if (!api) {
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      let tx = api.tx.childBounties.claimChildBounty(
        childBounty.parentBountyId,
        childBounty.index,
      );

      if (signerAccount?.proxyAddress) {
        tx = wrapWithProxy(api, tx, signerAccount.proxyAddress);
      }

      await sendTx({
        tx,
        setLoading: setIsLoading,
        dispatch,
        onFinalized: onClaimFinalized,
        onClose,
        signerAccount,
        isMounted,
      });
    },
    [
      dispatch,
      isMounted,
      showErrorToast,
      onClaimFinalized,
      onClose,
      childBounty,
      setIsLoading,
    ],
  );

  return (
    <SignerPopup
      title="Claim Bounty"
      actionCallback={doClaim}
      onClose={onClose}
      isLoading={isLoading}
    />
  );
}
