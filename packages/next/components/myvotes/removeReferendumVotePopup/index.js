import React from "react";
import { useCallback } from "react";
import { useDispatch } from "react-redux";

import useIsMounted from "next-common/utils/hooks/useIsMounted";
import { newErrorToast } from "next-common/store/reducers/toastSlice";
import { emptyFunction, toPrecision } from "next-common/utils";
import { sendTx, wrapWithProxy } from "next-common/utils/sendTx";
import SignerPopup from "next-common/components/signerPopup";
import PopupLabel from "next-common/components/popup/label";
import { getVoteBalance } from "../common";
import ValueDisplay from "next-common/components/valueDisplay";
import { useChainSettings } from "next-common/context/chain";
import { usePageProps } from "next-common/context/page";
import startCase from "lodash.startcase";
import useVotedPost from "../useVotedPost";
import {
  PostTitle,
  useIsReferenda,
} from "next-common/components/profile/votingHistory/common";
import isNil from "lodash.isnil";

function ReferendumTitle({ trackId, referendumIndex }) {
  const { tracks } = usePageProps();
  const post = useVotedPost(referendumIndex);
  if (post) {
    return (
      <PostTitle
        referendumIndex={referendumIndex}
        title={post.title}
        className="w-[260px]"
        noLink
      />
    );
  }
  let trackPrefix = "";
  if (!isNil(trackId)) {
    const track = tracks.find((t) => t.id === trackId);
    if (track) {
      trackPrefix = `[${startCase(track.name)}] `;
    } else {
      trackPrefix = `[Track ${trackId}] `;
    }
  }
  return <span>{`${trackPrefix} Referendum #${referendumIndex}`}</span>;
}

function ReferendumList({ votes }) {
  const { symbol, decimals } = useChainSettings();
  return (
    <div>
      <PopupLabel text="Current Voting" />
      {votes?.map(({ trackId, referendumIndex, vote }) => (
        <div
          key={referendumIndex}
          className="flex justify-between items-center py-[12px] text-[12px] font-medium text-textPrimary border-b border-neutral300"
        >
          <ReferendumTitle
            trackId={trackId}
            referendumIndex={referendumIndex}
          />
          <div className="flex items-center">
            <ValueDisplay
              value={toPrecision(getVoteBalance(vote), decimals)}
              symbol={symbol}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function RemoveReferendumVotePopup({
  votes,
  onClose,
  isLoading,
  setIsLoading = emptyFunction,
  onSubmitted = emptyFunction,
  onInBlock = emptyFunction,
}) {
  const dispatch = useDispatch();
  const isMounted = useIsMounted();
  const isReferenda = useIsReferenda();

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
        const { trackId, referendumIndex } = votes[0];
        if (isReferenda) {
          tx = api.tx.convictionVoting.removeVote(trackId, referendumIndex);
        } else {
          tx = api.tx.democracy.removeVote(referendumIndex);
        }
      } else if (votes?.length > 1) {
        const txs = votes.map(({ trackId, referendumIndex }) => {
          if (isReferenda) {
            return api.tx.convictionVoting.removeVote(trackId, referendumIndex);
          } else {
            return api.tx.democracy.removeVote(referendumIndex);
          }
        });
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
      isReferenda,
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
      extraContent={<ReferendumList votes={votes} />}
    />
  );
}
