import { useSelector } from "react-redux";
import { democracyLockPeriodSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import calcDemocracyVoteLock from "../calcDemocracyVoteLock";
import { VoteForItemWrapper } from "../../../styled";
import { VoteItem } from "next-common/components/profile/votingHistory/common";
import VoteLock from "../../../vote/lock";

export default function DemocracyVoteForItem({ vote }) {
  const lockPeriod = useSelector(democracyLockPeriodSelector);
  const [lockInfo, setLockInfo] = useState();

  useEffect(() => {
    if (!isNil(lockPeriod)) {
      setLockInfo(
        calcDemocracyVoteLock(vote?.vote, vote?.referendumInfo, lockPeriod),
      );
    }
  }, [lockPeriod, vote]);

  return (
    <VoteForItemWrapper>
      <VoteItem key="vote" vote={vote?.vote} />
      {lockInfo && <VoteLock lockInfo={lockInfo} />}
    </VoteForItemWrapper>
  );
}
