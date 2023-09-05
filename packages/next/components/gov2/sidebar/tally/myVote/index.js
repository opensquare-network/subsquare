import { useDetailType } from "next-common/context/page";
import { detailPageCategory } from "next-common/utils/consts/business/category";
import { useSelector } from "react-redux";
import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import useSubMyReferendaVote from "next-common/hooks/referenda/useSubMyReferendaVote";
import { usePost } from "next-common/context/post";
import { normalizeOnchainVote } from "next-common/utils/vote";
import { useState } from "react";
import RemoveReferendaVotePopup from "next-common/components/myReferendumVote/removeReferendaVotePopup";
import useReferendumVotingFinishHeight from "next-common/context/post/referenda/useReferendumVotingFinishHeight";
import isNil from "lodash.isnil";

export default function MyVote() {
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);
  const pageType = useDetailType();
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const trackId = post?.track;
  const { vote: onchainVote } = useSubMyReferendaVote(trackId, referendumIndex);
  const finishHeight = useReferendumVotingFinishHeight();

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

  if (detailPageCategory.FELLOWSHIP_REFERENDUM === pageType) {
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
        <RemoveReferendaVotePopup
          trackId={trackId}
          referendumIndex={referendumIndex}
          onClose={() => setShowRemoveVotePopup(false)}
        />
      )}
    </>
  );
}
