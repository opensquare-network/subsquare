export function normalizeVote(vote) {
  if (vote.isStandard) {
    const { balance, vote: _vote } = vote.asStandard;
    return {
      isStandard: true,
      balance: BigInt(balance.toJSON()),
      conviction: _vote.conviction.toNumber(),
      aye: _vote.isAye,
    };
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return {
      isSplit: true,
      ayeBalance: BigInt(aye.toJSON()),
      nayBalance: BigInt(nay.toJSON()),
    };
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return {
      isSplitAbstain: true,
      ayeBalance: BigInt(aye.toJSON()),
      nayBalance: BigInt(nay.toJSON()),
      abstainBalance: BigInt(abstain.toJSON()),
    };
  }

  return {};
}

export function getVoteBalance(vote) {
  if (vote.isStandard) {
    const { balance } = vote.asStandard;
    return BigInt(balance.toJSON());
  } else if (vote.isSplit) {
    const { aye, nay } = vote.asSplit;
    return BigInt(aye.toJSON()) + BigInt(nay.toJSON());
  } else if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.asSplitAbstain;
    return (
      BigInt(aye.toJSON()) + BigInt(nay.toJSON()) + BigInt(abstain.toJSON())
    );
  }

  return 0;
}
