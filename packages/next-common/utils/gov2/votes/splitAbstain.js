import { calcVotes, objectSpread } from "next-common/utils/democracy/votes/passed/common";

export default function extractSplitAbstainVote(account, vote) {
  const splitAbstain = vote.asSplitAbstain;
  const ayeBalance = splitAbstain.aye.toBigInt().toString();
  const nayBalance = splitAbstain.nay.toBigInt().toString();
  const abstainBalance = splitAbstain.abstain.toBigInt().toString();
  const common = {
    account,
    isDelegating: false,
    isSplitAbstain: true,
  };

  const result = [
    objectSpread(
      { ...common }, {
        balance: abstainBalance,
        isAbstain: true,
        conviction: 0,
        votes: calcVotes(abstainBalance, 0),
      },
    ),
  ];
  if (splitAbstain.aye.toBigInt() > 0) {
    result.push(objectSpread(
      { ...common }, {
        balance: ayeBalance,
        aye: true,
        conviction: 0,
        votes: calcVotes(ayeBalance, 0),
      }),
    );
  }

  if (splitAbstain.nay.toBigInt() > 0) {
    result.push(objectSpread(
      { ...common }, {
        balance: nayBalance,
        aye: false,
        conviction: 0,
        votes: calcVotes(nayBalance, 0),
      }));
  }

  return result;
}
