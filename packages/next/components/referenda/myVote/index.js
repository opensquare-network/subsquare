import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { normalizeOnchainVote } from "next-common/utils/vote";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";
import { useState } from "react";
import { usePost } from "next-common/context/post";
import RemoveDemocracyVotePopup from "next-common/components/myReferendumVote/removeDemocracyVotePopup";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import isNil from "lodash.isnil";

export default function MyVote() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const realAddress = useRealAddress();
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const { vote: onchainVote } = useSubMyDemocracyVote();
  const finishHeight = useDemocracyVoteFinishedHeight();

  // Retrieve the current vote from the chain
  let hasOnchainVote = false;
  let normalizedOnchainVote = [];
  if (onchainVote) {
    normalizedOnchainVote = normalizeOnchainVote(onchainVote);
    const isDelegating = !isNil(onchainVote.delegating);
    hasOnchainVote = normalizedOnchainVote?.length > 0 && !isDelegating;
  }

  // If the referendum is finished, we don't need to show the onchain vote
  if (!finishHeight) {
    votes = normalizedOnchainVote;
  }

  if (!realAddress) {
    return null;
  }

  return (
    <>
      <MyVoteCommon
        votes={votes}
        hasOnchainVote={hasOnchainVote}
        setShowRemoveVotePopup={setShowRemoveVotePopup}
      />
      {showRemovePopup && (
        <RemoveDemocracyVotePopup
          referendumIndex={referendumIndex}
          onClose={() => setShowRemoveVotePopup(false)}
        />
      )}
    </>
  );
}
