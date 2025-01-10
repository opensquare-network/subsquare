import VotePanel from "./panel";
import { memo } from "react";

function SplitAbstainVotePanel({ splitAbstain }) {
  if (!splitAbstain) {
    throw new Error(`No splitAbstain given for SplitAbstainVotePanel`);
  }

  const { aye, nay, abstain } = splitAbstain;
  const votes = [
    {
      isSplitAbstain: true,
      aye: true,
      balance: aye.toString(),
      conviction: 0,
    },
    {
      isSplitAbstain: true,
      aye: false,
      balance: nay.toString(),
      conviction: 0,
    },
    {
      isSplitAbstain: true,
      isAbstain: true,
      balance: abstain.toString(),
      conviction: 0,
    },
  ];

  return <VotePanel type="SplitAbstain" votes={votes} />;
}

export default memo(SplitAbstainVotePanel);
