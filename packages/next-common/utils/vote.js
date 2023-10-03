import { getConviction, isAye } from "./referendumCommon";

export function normalizeOnchainVote(vote) {
  if (vote?.standard) {
    return [
      {
        aye: isAye(vote?.standard?.vote),
        balance: vote?.standard?.balance,
        conviction: getConviction(vote?.standard?.vote),
      },
    ];
  } else if (vote?.split) {
    return [
      {
        aye: true,
        balance: vote?.split?.aye,
        conviction: 0,
      },
      {
        aye: false,
        balance: vote?.split?.nay,
        conviction: 0,
      },
    ];
  } else if (vote?.splitAbstain) {
    return [
      {
        aye: true,
        balance: vote?.splitAbstain?.aye,
        conviction: 0,
      },
      {
        aye: false,
        balance: vote?.splitAbstain?.nay,
        conviction: 0,
      },
      {
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
