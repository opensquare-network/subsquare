import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";

export default function MyVote() {
  const allVotes = useSelector(allVotesSelector);

  return <MyVoteCommon allVotes={allVotes} />;
}
