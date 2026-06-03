import VotePanel from "./panel";
import { isAye, getConviction } from "next-common/utils/referendumCommon";
import { memo } from "react";

function StandardVotePanel({ standard, delegations }) {
  if (!standard) {
    throw new Error("No standard given for StandardVotePanel");
  }

  const { vote, balance } = standard;
  const normalized = {
    isStandard: true,
    aye: isAye(vote),
    balance: balance.toString(),
    conviction: getConviction(vote),
  };

  return (
    <VotePanel type="Standard" votes={[normalized]} delegations={delegations} />
  );
}

export default memo(StandardVotePanel);
