import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import { Democracy } from "next-common/components/profile/votingHistory/common";

export default function MyVoteOnFinishedDemocracyReferendum() {
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  //  Here we don't show remove my vote operation on finished referendum
  return (
    <MyVoteCommon
      votesManagementPath={`/votes?type=${Democracy}`}
      votes={votes}
      hasOnchainVote={false}
    />
  );
}
