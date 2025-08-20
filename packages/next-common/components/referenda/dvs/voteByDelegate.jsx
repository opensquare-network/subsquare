import { groupBy, isNil } from "lodash-es";
import { cn } from "next-common/utils";
import Tooltip from "next-common/components/tooltip";
import VoteProgress, { VoteValues } from "./common/voteProgress";
import getVoteType from "next-common/utils/dv/voteType";
import { useReferendaDvCount } from "next-common/context/referenda/dv";

export default function VoteByDelegate({
  height = 8,
  className = "",
  delegate,
  userVote,
}) {
  const count = useReferendaDvCount();
  if (isNil(delegate) || isNil(userVote)) return null;

  const vote = userVote.map(getVoteType);

  const { Aye = [], Nay = [], Abstain = [] } = groupBy(vote);

  const ayeCount = Aye.length;
  const nayCount = Nay.length;
  const abstainCount = Abstain.length;

  const ayePercentage = (ayeCount / count) * 100;
  const nayPercentage = (nayCount / count) * 100;
  const abstainPercentage = (abstainCount / count) * 100;

  return (
    <div className={cn("flex flex-col gap-0", className)}>
      <VoteValues aye={ayeCount} nay={nayCount} abstain={abstainCount} />
      <Tooltip content={`Total votes: ${vote.length}/${count}`}>
        <VoteProgress
          height={height}
          aye={ayePercentage}
          nay={nayPercentage}
          abstain={abstainPercentage}
        />
      </Tooltip>
    </div>
  );
}
