// used on finished referenda detail page

import { allVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import { Referenda } from "next-common/components/profile/votingHistory/common";

export default function MyVoteOnFinishedReferendum() {
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  return (
    <MyVoteCommon
      votesManagementPath={`/votes?type=${Referenda}`}
      votes={votes}
      hasOnchainVote={false}
      setShowRemoveVotePopup={setShowRemoveVotePopup}
    />
  );
}
