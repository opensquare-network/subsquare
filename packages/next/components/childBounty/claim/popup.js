import { useDispatch } from "react-redux";

import useApi from "next-common/utils/hooks/useApi";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction } from "next-common/utils";
import { getSigner, sendTx } from "next-common/utils/sendTx";
import MaybeLoginWithAction from "next-common/components/maybeLoginWithAction";
import { useUser } from "next-common/context/user";
import { useCallback } from "react";

export default function ClaimPopup({
  childBounty,
  onClose,
  onSubmitted = emptyFunction,
  onFinalized = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const api = useApi();
  const loginUser = useUser();

  const showErrorToast = useCallback(
    (message) => dispatch(newErrorToast(message)),
    []
  );

  const doClaim = useCallback(async () => {
    if (!api) {
      return showErrorToast("Chain network is not connected yet");
    }

    if (!loginUser) {
      return showErrorToast("Please login first");
    }

    const signerAddress = loginUser.address;

    try {
      const signer = await getSigner(signerAddress);
      api.setSigner(signer);
    } catch (e) {
      return showErrorToast(`Unable to find injected ${signerAddress}`);
    }

    const tx = api.tx.childBounties.claimChildBounty(
      childBounty.parentBountyId,
      childBounty.index
    );

    await sendTx({
      tx,
      dispatch,
      onFinalized,
      onInBlock,
      onSubmitted,
      onClose,
      signerAddress,
      isMounted,
    });
  }, [
    api,
    dispatch,
    isMounted,
    showErrorToast,
    loginUser,
    onFinalized,
    onInBlock,
    onSubmitted,
    onClose,
  ]);

  return <MaybeLoginWithAction actionCallback={doClaim} onClose={onClose} />;
}
