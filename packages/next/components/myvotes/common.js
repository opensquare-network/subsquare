export function normalizeVote(vote) {
  if (vote.isStandard) {
    const { balance, vote: _vote } = vote.asStandard;
    return {
      isStandard: true,
      balance: balance.toNumber(),
      conviction: _vote.conviction.toNumber(),
      aye: _vote.isAye,
    };
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return {
      isSplit: true,
      ayeBalance: aye.toNumber(),
      nayBalance: nay.toNumber(),
    };
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return {
      isSplitAbstain: true,
      ayeBalance: aye.toNumber(),
      nayBalance: nay.toNumber(),
      abstainBalance: abstain.toNumber(),
    };
  }

  return {};
}

export function getVoteBalance(vote) {
  if (vote.isStandard) {
    const { balance } = vote.asStandard;
    return balance.toNumber();
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return aye.toNumber() + nay.toNumber();
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return aye.toNumber() + nay.toNumber() + abstain.toNumber();
  }

  return 0;
}
