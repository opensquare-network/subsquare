// used on finished referenda detail page

import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import { Referenda } from "next-common/components/profile/votingHistory/common";
import {
  useSharedMyReferendumVote,
  useSharedRemovePopupOpen,
} from "next-common/context/referenda/myVote";
import { useOnchainData } from "next-common/context/post";

function isMyVoteOnChain(vote, referendumIndex) {
  if (!vote || !vote.isCasting) {
    return false;
  }
  const casting = vote.asCasting;
  return casting.votes.find((v) => v[0].toNumber() === referendumIndex);
}

export default function MyVoteOnFinishedReferendum() {
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);
  const [, setRemovePopupOpen] = useSharedRemovePopupOpen();
  const [myVote] = useSharedMyReferendumVote();
  const { referendumIndex } = useOnchainData();

  return (
    <MyVoteCommon
      votesManagementPath={`/votes?type=${Referenda}`}
      votes={votes}
      hasOnchainVote={isMyVoteOnChain(myVote, referendumIndex)}
      setShowRemoveVotePopup={setRemovePopupOpen}
    />
  );
}
