import React, { useCallback, useState } from "react";
import { useDispatch } from "react-redux";

import { useMountedState } from "react-use";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import SignerPopup from "next-common/components/signerPopup";
import PopupLabel from "next-common/components/popup/label";
import RelatedReferenda from "../popupCommon/relatedReferenda";
import {
  encodeRemoveVoteForTrackData,
  encodeUnlockData,
} from "next-common/utils/moonPrecompiles/convictionVoting";
import { encodeBatchAllData } from "next-common/utils/moonPrecompiles/batch";
import { encodeProxyData } from "next-common/utils/moonPrecompiles/proxy";
import { sendEvmTx } from "next-common/utils/sendEvmTx";

function ExtraInfo({ relatedReferenda, relatedTracks }) {
  return (
    <>
      <RelatedReferenda relatedReferenda={relatedReferenda} />
      <div>
        <PopupLabel text="Unlock tracks" />
        <div className="text-[12px] font-medium text-textPrimary py-[12px] border-b border-b-neutral300">
          {relatedTracks.length ? (
            relatedTracks.map((trackId) => `#${trackId}`).join(", ")
          ) : (
            <span className="text-textTertiary">None</span>
          )}
        </div>
      </div>
    </>
  );
}

export default function MoonClearExpiredReferendaVotePopup({
  votes = [],
  unlockTracks = [],
  onClose,
}) {
  const dispatch = useDispatch();
  const isMounted = useMountedState();
  const [isLoading, setIsLoading] = useState(false);

  const relatedReferenda = Array.from(
    new Set((votes || []).map(({ referendumIndex }) => referendumIndex)),
  );
  relatedReferenda.sort((a, b) => a - b);

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

      if (!votes?.length && unlockTracks.length <= 0) {
        return showErrorToast("No unLockable balance");
      }

      const signerAddress = signerAccount.address;
      const realAddress = signerAccount.proxyAddress || signerAddress;

      const txsRemoveVote = votes.map(({ trackId, referendumIndex }) =>
        encodeRemoveVoteForTrackData({ trackId, pollIndex: referendumIndex }),
      );
      const txsUnlock = unlockTracks.map((trackId) =>
        encodeUnlockData({ trackId, targetAddress: realAddress }),
      );

      let toParam = [],
        valueParam = [],
        callDataParam = [],
        gasLimitParam = [];

      for (const txRemoveVote of txsRemoveVote) {
        toParam.push(txRemoveVote.callTo);
        callDataParam.push(txRemoveVote.callData);
      }
      for (const txUnlock of txsUnlock) {
        toParam.push(txUnlock.callTo);
        callDataParam.push(txUnlock.callData);
      }

      let callTo, callData;
      if (toParam.length === 1) {
        callTo = toParam[0];
        callData = callDataParam[0];
      } else {
        ({ callTo, callData } = encodeBatchAllData({
          to: toParam,
          value: valueParam,
          callData: callDataParam,
          gasLimit: gasLimitParam,
        }));
      }

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
    [dispatch, isMounted, showErrorToast, onClose, votes, unlockTracks],
  );

  return (
    <SignerPopup
      title="Clear Expired Votes"
      actionCallback={doClearExpiredVote}
      onClose={onClose}
      isLoading={isLoading}
    >
      <ExtraInfo
        relatedReferenda={relatedReferenda}
        relatedTracks={unlockTracks}
      />
    </SignerPopup>
  );
}
