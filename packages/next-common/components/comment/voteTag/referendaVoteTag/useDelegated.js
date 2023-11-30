export default function useDelegated(address, allNestedVotes) {
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
