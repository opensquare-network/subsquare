import { useSelector } from "react-redux";
import { allNestedVotesSelector } from "next-common/store/reducers/referenda/votes/selectors";

export default function useDelegated(address) {
  const allNestedVotes = useSelector(allNestedVotesSelector);

  const allVotes = [...allNestedVotes.allAye, ...allNestedVotes.allNay];
  const nestedVote = allVotes.find((item) => item.account === address);

  const delegationsCount = nestedVote?.directVoterDelegations?.length ?? 0;
  if (delegationsCount === 0) {
    return {
      count: 0,
      delegations: 0,
    };
  }

  return {
    count: delegationsCount,
    delegations: nestedVote?.totalDelegatedVotes ?? 0,
  };
}
