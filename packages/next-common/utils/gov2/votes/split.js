import { calcVotes } from "next-common/utils/democracy/votes/passed/common";

export default function extractSplitVote(account, vote) {
  const split = vote.asSplit;
  const ayeBalance = split.aye.toBigInt().toString();
  const nayBalance = split.nay.toBigInt().toString();
  const common = {
    account,
    isDelegating: false,
    isSplit: true,
  };

  const result = [];
  if (split.aye.toBigInt() > 0) {
    result.push({
      ...common,
      balance: ayeBalance,
      aye: true,
      conviction: 0,
      votes: calcVotes(ayeBalance, 0),
    });
  }
  if (split.nay.toBigInt() > 0) {
    result.push({
      ...common,
      balance: nayBalance,
      aye: false,
      conviction: 0,
      votes: calcVotes(nayBalance, 0),
    });
  }

  return result;
}
