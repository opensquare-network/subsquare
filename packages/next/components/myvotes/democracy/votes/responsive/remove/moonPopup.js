import { noop } from "lodash-es";
import { useDispatch } from "react-redux";
import React, { useCallback, useState } from "react";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import useIsMounted from "next-common/utils/hooks/useIsMounted";
import SignerPopup from "next-common/components/signerPopup";
import RelatedReferenda from "../../../../popupCommon/relatedReferenda";
import { encodeRemoveVoteData } from "next-common/utils/moonPrecompiles/democracy";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";

export default function ReferendumRemovalPopup({
  referendumIndex,
  onClose = noop,
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

      let { callTo, callData } = encodeRemoveVoteData({
        refIndex: referendumIndex,
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
