import { allVotesSelector } from "next-common/store/reducers/democracy/votes/selectors";
import { useSelector } from "react-redux";
import MyVoteCommon from "next-common/components/myReferendumVote";
import useMyVotes from "next-common/components/myReferendumVote/useMyVotes";
import { normalizeOnchainVote } from "next-common/utils/vote";
import useSubMyDemocracyVote from "next-common/hooks/democracy/useSubMyVote";

export default function MyVote() {
  const allVotes = useSelector(allVotesSelector);
  let votes = useMyVotes(allVotes);

  const { vote: onchainVote } = useSubMyDemocracyVote();

  let hasOnchainVote = false;
  if (onchainVote) {
    hasOnchainVote = true;
    votes = normalizeOnchainVote(onchainVote);
  }

  return <MyVoteCommon votes={votes} hasOnchainVote={hasOnchainVote} />;
}
