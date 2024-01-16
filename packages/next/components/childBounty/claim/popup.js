import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";

export default function ClaimPopup({ childBounty, onClose }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const [isLoading, setIsLoading] = useState(false);

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

      const signerAddress = signerAccount.address;

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
        onClose,
        signerAddress,
        isMounted,
      });
    },
    [dispatch, isMounted, showErrorToast, onClose, childBounty, setIsLoading],
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
