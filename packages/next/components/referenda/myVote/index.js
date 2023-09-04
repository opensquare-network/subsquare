import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { normalizeOnchainVote } from "next-common/utils/vote";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";
import { useState } from "react";
import { usePost } from "next-common/context/post";
import RemoveDemocracyVotePopup from "next-common/components/myReferendumVote/removeDemocracyVotePopup";

export default function MyVote() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const { vote: onchainVote } = useSubMyDemocracyVote();

  let hasOnchainVote = false;
  if (onchainVote) {
    hasOnchainVote = true;
    votes = normalizeOnchainVote(onchainVote);
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
