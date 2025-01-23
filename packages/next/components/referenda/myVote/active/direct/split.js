import { memo } from "react";
import VotePanel from "../panel";

function SplitVotePanel({ split }) {
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

  return <VotePanel type="Standard" votes={votes} />;
}

export default memo(SplitVotePanel);
