import { calcVotes } from "next-common/utils/democracy/votes/passed/common";

export default function extractStandardVote(account, vote) {
  const standard = vote.asStandard;
  const balance = standard.balance.toBigInt().toString();
  const conviction = standard.vote.conviction.toNumber();

  return [
    {
      account,
      isDelegating: false,
      isStandard: true,
      balance,
      aye: standard.vote.isAye,
      conviction: standard.vote.conviction.toNumber(),
      votes: calcVotes(balance, conviction),
    },
  ];
}
