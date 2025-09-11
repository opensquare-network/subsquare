import { useSelector } from "react-redux";
import myDemocracyVotesSelector from "next-common/store/reducers/myOnChainData/democracy/selectors/votes";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import ListWrapper from "../../../mobile/listWrapper";
import ProxyHint from "../../../proxyHint";
import { democracyLockPeriodSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import calcDemocracyVoteLock from "../calcDemocracyVoteLock";
import { ListCard } from "../../../styled";
import {
  PostTitle,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import getPostTitle from "../../delegatedVotes/getPostTitle";
import RemoveVoteButton from "./remove";
import VoteLock from "../../../vote/lock";
import DemocracyTag from "../../stateTag";
import { EmptyList } from "next-common/components/emptyList";

function ItemHeader({ vote }) {
  return (
    <>
      <div className="flex items-center justify-between pb-[12px] border-b border-b-neutral300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={getPostTitle(vote)}
        />
        <RemoveVoteButton key="action" referendumIndex={vote.referendumIndex} />
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <DemocracyTag
          key="tag"
          post={vote.post}
          onchainInfo={vote.referendumInfo}
        />
        ,
      </div>
    </>
  );
}

function VoteListItem({ vote }) {
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
    <ListCard>
      <ItemHeader vote={vote} />
      <div className="flex flex-col mt-[24px] gap-2">
        <VoteItem vote={vote?.vote} />
        {lockInfo && <VoteLock lockInfo={lockInfo} />}
      </div>
    </ListCard>
  );
}

export default function MobileList() {
  const myDemocracyVotes = useSelector(myDemocracyVotesSelector);
  const voting = useSelector(myDemocracyVotingSelector);
  const isLoading = !voting;

  return (
    <ListWrapper isLoading={isLoading}>
      <ProxyHint />
      {myDemocracyVotes.map((vote) => (
        <VoteListItem key={vote.referendumIndex} vote={vote} />
      ))}
      {myDemocracyVotes.length <= 0 ? <EmptyList type="votes" /> : null}
    </ListWrapper>
  );
}
