export default function normalizeDemocracyVote(vote) {
  if (vote.isStandard) {
    const standard = vote.asStandard;
    return {
      isStandard: true,
      balance: standard.balance.toString(),
      aye: standard.vote.isAye,
      conviction: standard.vote.conviction.toNumber(),
    };
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return {
      isSplit: true,
      ayeBalance: aye.toString(),
      nayBalance: nay.toString(),
    };
  }

  throw new Error(`Unknown vote type, ${vote.toJSON()}`);
}
