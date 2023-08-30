import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";

export default function MyVote() {
  const allVotes = useSelector(allVotesSelector);
  const votes = useMyVotes(allVotes);
  return <MyVoteCommon votes={votes} />;
}
