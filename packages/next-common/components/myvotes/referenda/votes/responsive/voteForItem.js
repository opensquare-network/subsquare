import { VoteForItemWrapper } from "../../../styled";
import { VoteItem } from "next-common/components/profile/votingHistory/common";
import { useSelector } from "react-redux";
import { convictionVotingLockPeriodSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import calcReferendaVoteLock from "../calcReferendaVoteLock";
import VoteLock from "../../../vote/lock";

export default function ReferendaVoteForItem({ vote }) {
  const lockPeriod = useSelector(convictionVotingLockPeriodSelector);
  const [lockInfo, setLockInfo] = useState();

  useEffect(() => {
    if (!isNil(lockPeriod)) {
      setLockInfo(
        calcReferendaVoteLock(vote?.vote, vote?.referendumInfo, lockPeriod),
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
