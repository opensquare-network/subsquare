import BigNumber from "bignumber.js";
import { convictionToLockXNumber } from "next-common/utils/referendumCommon";

export function normalizeCall(vote) {
  if (vote.isStandard) {
    const {
      balance,
      vote: { isAye, conviction },
    } = vote.vote;
    return {
      ...vote,
      balance,
      conviction,
      aye: isAye,
      votes: new BigNumber(balance)
        .times(convictionToLockXNumber(conviction))
        .toFixed(),
    };
  }

  if (vote.isSplit) {
    const { aye, nay } = vote.vote;
    return {
      ...vote,
      aye,
      nay,
      ayeVotes: new BigNumber(aye).times(0.1).toFixed(),
      nayVotes: new BigNumber(nay).times(0.1).toFixed(),
    };
  }

  if (vote.isSplitAbstain) {
    const { aye, nay, abstain } = vote.vote;
    return {
      ...vote,
      aye,
      nay,
      abstain,
      ayeVotes: new BigNumber(aye).times(0.1).toFixed(),
      nayVotes: new BigNumber(nay).times(0.1).toFixed(),
      abstainVotes: new BigNumber(abstain).times(0.1).toFixed(),
    };
  }

  return vote;
}
