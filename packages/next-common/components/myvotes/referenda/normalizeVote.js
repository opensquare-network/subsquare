import normalizeDemocracyVote from "../democracy/normalize";

export default function normalizeReferendaVote(vote) {
  if (vote.isStandard || vote.isSplit) {
    return normalizeDemocracyVote(vote);
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return {
      isSplitAbstain: true,
      ayeBalance: aye.toString(),
      nayBalance: nay.toString(),
      abstainBalance: abstain.toString(),
    };
  }

  throw new Error(
    `Unknown vote type when normalize referenda vote, ${vote.toJSON()}`,
  );
}
