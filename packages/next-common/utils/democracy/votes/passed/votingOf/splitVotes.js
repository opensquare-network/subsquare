function extractSplitVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isSplit)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asDirect.votes.filter(([idx]) =>
          idx.eq(targetReferendumIndex),
        ),
      };
    })
    ;
}

export default extractSplitVotes;
