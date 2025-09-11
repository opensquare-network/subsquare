import { memo } from "react";
import VotePanel from "../panel";

function StandardVotePanel({ standard, delegations }) {
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
