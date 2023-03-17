function extractSplitVotes(mapped, targetReferendumIndex) {
  console.log("mapped", mapped);
  return mapped
    .filter(({ voting }) => voting.isSplit)
    .map(({ account, voting }) => {
      console.log("voting", voting);
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
