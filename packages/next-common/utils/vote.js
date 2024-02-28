import { getConviction, isAye } from "./referendumCommon";

export function normalizeOnchainVote(vote) {
  if (vote?.standard) {
    return [
      {
        isStandard: true,
        aye: isAye(vote?.standard?.vote),
        balance: vote?.standard?.balance,
        conviction: getConviction(vote?.standard?.vote),
      },
    ];
  } else if (vote?.split) {
    return [
      {
        isSplit: true,
        aye: true,
        balance: vote?.split?.aye,
        conviction: 0,
      },
      {
        isSplit: true,
        aye: false,
        balance: vote?.split?.nay,
        conviction: 0,
      },
    ];
  } else if (vote?.splitAbstain) {
    return [
      {
        isSplitAbstain: true,
        aye: true,
        balance: vote?.splitAbstain?.aye,
        conviction: 0,
      },
      {
        isSplitAbstain: true,
        aye: false,
        balance: vote?.splitAbstain?.nay,
        conviction: 0,
      },
      {
        isSplitAbstain: true,
        isAbstain: true,
        balance: vote?.splitAbstain?.abstain,
        conviction: 0,
      },
    ];
  } else if (vote?.delegating?.voted) {
    return [
      {
        aye: vote?.delegating?.aye,
        balance: vote?.delegating?.balance,
        conviction: vote?.delegating?.conviction,
        isDelegating: true,
        target: vote?.delegating?.target,
      },
    ];
  }

  return [];
}
