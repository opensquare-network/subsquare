import VotePanel from "./panel";
import { memo } from "react";

function SplitVotePanel({ split }) {
  if (!split) {
    throw new Error(`No split given for SplitVotePanel`);
  }

  const { aye, nay } = split;
  const votes = [
    {
      isSplit: true,
      aye: true,
      balance: aye.toString(),
      conviction: 0,
    },
    {
      isSplit: true,
      aye: false,
      balance: nay.toString(),
      conviction: 0,
    },
  ];

  return <VotePanel type="Split" votes={votes} />;
}

export default memo(SplitVotePanel);
