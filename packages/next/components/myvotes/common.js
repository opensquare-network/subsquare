export function normalizeVote(vote) {
  if (vote.isStandard) {
    const { balance, vote: _vote } = vote.asStandard;
    return {
      isStandard: true,
      balance: balance.toBigInt(),
      conviction: _vote.conviction.toNumber(),
      aye: _vote.isAye,
    };
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return {
      isSplit: true,
      ayeBalance: aye.toBigInt(),
      nayBalance: nay.toBigInt(),
    };
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return {
      isSplitAbstain: true,
      ayeBalance: aye.toBigInt(),
      nayBalance: nay.toBigInt(),
      abstainBalance: abstain.toBigInt(),
    };
  }

  return {};
}

export function getVoteBalance(vote) {
  if (vote.isStandard) {
    const { balance } = vote.asStandard;
    return balance.toBigInt();
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return aye.toBigInt() + nay.toBigInt();
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return aye.toBigInt() + nay.toBigInt() + abstain.toBigInt();
  }

  return BigInt(0);
}
