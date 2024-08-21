import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import useSubMyReferendaVote from "next-common/hooks/referenda/useSubMyReferendaVote";
import { usePost } from "next-common/context/post";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useState } from "react";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Referenda } from "next-common/components/profile/votingHistory/common";
import dynamicPopup from "next-common/lib/dynamic/popup";

const RemoveReferendaVotePopup = dynamicPopup(() =>
  import("next-common/components/myReferendumVote/removeReferendaVotePopup"),
);

export default function MyVote() {
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);

  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const trackId = post?.track;

  const address = useRealAddress();
  const { vote: onchainVote } = useSubMyReferendaVote(
    trackId,
    referendumIndex,
    address,
  );

  const finishHeight = useReferendumVotingFinishHeight();

  let hasOnchainVote = false;
  let normalizedOnchainVote = [];
  if (onchainVote) {
    normalizedOnchainVote = normalizeOnchainVote(onchainVote);
    const isDelegating = !isNil(onchainVote.delegating);
    hasOnchainVote = normalizedOnchainVote?.length > 0 && !isDelegating;
  }

  if (!finishHeight) {
    votes = normalizedOnchainVote;
  }

  return (
    <>
      <MyVoteCommon
        votesManagementPath={`/votes?type=${Referenda}`}
        votes={votes}
        hasOnchainVote={hasOnchainVote}
        setShowRemoveVotePopup={setShowRemoveVotePopup}
      />
      {showRemovePopup && (
        <RemoveReferendaVotePopup
          trackId={trackId}
          referendumIndex={referendumIndex}
          onClose={() => setShowRemoveVotePopup(false)}
        />
      )}
    </>
  );
}
