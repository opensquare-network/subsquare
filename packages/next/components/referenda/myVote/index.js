import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { normalizeOnchainVote } from "next-common/utils/vote";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";
import { useState } from "react";
import { usePost } from "next-common/context/post";
import RemoveDemocracyVotePopup from "next-common/components/myReferendumVote/removeDemocracyVotePopup";
import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import isNil from "lodash.isnil";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function MyVote() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const realAddress = useRealAddress();
  const { vote: onchainVote } = useSubMyDemocracyVote(realAddress);
  const finishHeight = useDemocracyVoteFinishedHeight();

  // Retrieve the current vote from the chain
  let hasDirectOnchainVote = false;
  let normalizedOnchainVotes = [];
  if (onchainVote) {
    normalizedOnchainVotes = normalizeOnchainVote(onchainVote);
    const isDelegating = !isNil(onchainVote.delegating);
    hasDirectOnchainVote = normalizedOnchainVotes?.length > 0 && !isDelegating;
  }

  if (!finishHeight) {
    votes = normalizedOnchainVotes;
  }

  return (
    <>
      <MyVoteCommon
        votes={votes}
        hasOnchainVote={hasDirectOnchainVote}
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
