import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { normalizeOnchainVote } from "next-common/utils/vote";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";
import { useState } from "react";
import { usePost } from "next-common/context/post";
import RemoveDemocracyVotePopup from "next-common/components/myReferendumVote/removeDemocracyVotePopup";
import MoonRemoveDemocracyVotePopup from "next-common/components/myReferendumVote/removeDemocracyVotePopup/moonPopup";
import useDemocracyVoteFinishedHeight from "next-common/context/post/democracy/referendum/voteFinishedHeight";
import { isNil } from "lodash-es";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { Democracy } from "next-common/components/profile/votingHistory/common";
import useIsUseMetamask from "next-common/hooks/useIsUseMetamask";
import isMoonChain from "next-common/utils/isMoonChain";

export default function MyVote() {
  const post = usePost();
  const referendumIndex = post?.referendumIndex;
  const [showRemovePopup, setShowRemoveVotePopup] = useState(false);
  const isUseMetamask = useIsUseMetamask();

  let Popup = RemoveDemocracyVotePopup;
  if (isMoonChain() && isUseMetamask) {
    Popup = MoonRemoveDemocracyVotePopup;
  }

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
        votesManagementPath={`/votes?type=${Democracy}`}
        votes={votes}
        hasOnchainVote={hasDirectOnchainVote}
        setShowRemoveVotePopup={setShowRemoveVotePopup}
      />
      {showRemovePopup && (
        <Popup
          referendumIndex={referendumIndex}
          onClose={() => setShowRemoveVotePopup(false)}
        />
      )}
    </>
  );
}
