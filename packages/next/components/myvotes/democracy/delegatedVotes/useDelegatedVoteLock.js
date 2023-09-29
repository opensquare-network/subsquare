import useVoteLockingPeriod from "next-common/hooks/useVoteLockingPeriod";
import { useEffect, useState } from "react";
import calcDemocracyDelegateVoteLock from "../calcDemocracyDelegateVoteLock";

export default function useDelegatedVoteLock(
  referendumInfo,
  delegatedVote,
  targetVote,
) {
  const period = useVoteLockingPeriod("democracy");
  const [lockInfo, setLockInfo] = useState();

  useEffect(() => {
    if (period) {
      setLockInfo(
        calcDemocracyDelegateVoteLock(
          referendumInfo,
          period,
          delegatedVote,
          targetVote,
        ),
      );
    }
  }, [period, referendumInfo, delegatedVote, targetVote]);

  return lockInfo;
}
