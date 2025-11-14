import { SystemYes, SystemNo, SystemVoteAbstain } from "@osn/icons/subsquare";
import { PostProvider, usePostState } from "next-common/context/post";
import { useReferendumTally } from "next-common/hooks/referenda/useReferendumInfo";
import { useInfluence } from "next-common/hooks/referenda/useInfluence";
import Tooltip from "next-common/components/tooltip";
import { gov2State } from "next-common/utils/consts/state";

export function InfluenceValueImpl({ referendumVotes, isFinal }) {
  const tally = useReferendumTally();
  const { hasInfluence, isPass } = useInfluence(tally, referendumVotes);
  const stateName = usePostState();

  if (!tally) {
    return null;
  }

  const noNeedComparison = [
    gov2State.TimedOut,
    gov2State.Timeout,
    gov2State.Preparing,
    gov2State.Queueing,
    gov2State.Killed,
    gov2State.Cancelled,
  ].includes(stateName);

  if (noNeedComparison) {
    return <SystemVoteAbstain />;
  }

  let tooltipContent;
  if (isFinal) {
    const tipsStateText = isPass ? "pass" : "fail";
    if (hasInfluence) {
      tooltipContent = `This referendum won't ${tipsStateText} if no DV delegations`;
    } else {
      tooltipContent =
        "DV delegations didn't change the result of this referendum";
    }
  } else {
    const tipsStateText = isPass ? "passing" : "failing";
    if (hasInfluence) {
      tooltipContent = `This referendum will stay ${tipsStateText} if no DV delegations`;
    } else {
      tooltipContent = `This referendum will keep ${tipsStateText} if no DV delegations`;
    }
  }

  const icon = hasInfluence ? <SystemYes /> : <SystemNo />;

  return (
    <Tooltip className="flex justify-end" content={tooltipContent}>
      {icon}
    </Tooltip>
  );
}

export default function InfluenceValue({ referendum, referendumVotes = [] }) {
  if (!referendum) {
    return null;
  }

  return (
    <PostProvider post={referendum}>
      <InfluenceValueImpl
        referendumVotes={referendumVotes}
        isFinal={referendum.isFinal}
      />
    </PostProvider>
  );
}
