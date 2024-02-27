import React, { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import SignerPopup from "next-common/components/signerPopup";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import {
  encodeRemoveVoteData,
  encodeUnlockData,
} from "next-common/utils/moonPrecompiles/democracy";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";

export default function MoonClearExpiredDemocracyVotePopup({ votes, onClose }) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
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
        return showErrorToast("Chain network is not connected yet");
      }

      if (!signerAccount) {
        return showErrorToast("Please login first");
      }

      const signerAddress = signerAccount.address;
      const realAddress = signerAccount.proxyAddress || signerAddress;

      const txsRemoveVote = relatedReferenda.map((referendumIndex) =>
        encodeRemoveVoteData({ refIndex: referendumIndex }),
      );
      const txUnlock = encodeUnlockData({ targetAddress: realAddress });

      let toParam = [],
        valueParam = [],
        callDataParam = [],
        gasLimitParam = [];

      for (const txRemoveVote of txsRemoveVote) {
        toParam.push(txRemoveVote.callTo);
        callDataParam.push(txRemoveVote.callData);
      }
      toParam.push(txUnlock.callTo);
      callDataParam.push(txUnlock.callData);

      let { callTo, callData } = encodeBatchAllData({
        to: toParam,
        value: valueParam,
        callData: callDataParam,
        gasLimit: gasLimitParam,
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
