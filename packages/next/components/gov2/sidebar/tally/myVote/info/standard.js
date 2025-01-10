import VotePanel from "./panel";
import { memo } from "react";

function StandardVotePanel({ standard, delegations }) {
  if (!standard) {
    throw new Error("No standard given for StandardVotePanel");
  }

  const { vote, balance } = standard;
  const normalized = {
    isStandard: true,
    aye: vote.isAye,
    balance: balance.toString(),
    conviction: vote.conviction.toNumber(),
  };

  return (
    <VotePanel type="Standard" votes={[normalized]} delegations={delegations} />
  );
}

export default memo(StandardVotePanel);
