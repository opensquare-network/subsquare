import { useSelector } from "react-redux";
import { isLoadingReferendaVotingSelector } from "next-common/store/reducers/myOnChainData/referenda/myReferendaVoting";
import { ListCard } from "../../../styled";
import myReferendaVotesSelector from "next-common/store/reducers/myOnChainData/referenda/selectors/votes";
import ProxyHint from "../../../proxyHint";
import {
  PostTitle,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import getPostTitle from "./getPostTitle";
import MyReferendaVoteTag from "../stateTag";
import RemoveVoteButton from "./remove";
import ListWrapper from "../../../mobile/listWrapper";
import { convictionVotingLockPeriodSelector } from "next-common/store/reducers/chainSlice";
import { useEffect, useState } from "react";
import { isNil } from "lodash-es";
import calcReferendaVoteLock from "../calcReferendaVoteLock";
import VoteLock from "../../../vote/lock";
import { EmptyList } from "next-common/components/emptyList";

function ItemHeader({ vote }) {
  return (
    <>
      <div className="flex items-center justify-between pb-[12px] border-b border-b-neutral300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={getPostTitle(vote)}
        />
        {vote.vote?.isDelegating ? null : (
          <RemoveVoteButton key="action" vote={vote} />
        )}
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <MyReferendaVoteTag
          post={vote?.post}
          onchainInfo={vote?.referendumInfo}
        />
      </div>
    </>
  );
}

function VoteListItem({ vote }) {
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
  const referendaVotes = useSelector(myReferendaVotesSelector);
  const isLoading = useSelector(isLoadingReferendaVotingSelector);

  return (
    <ListWrapper isLoading={isLoading}>
      <ProxyHint />
      {referendaVotes.map((vote) => (
        <VoteListItem key={vote.referendumIndex} vote={vote} />
      ))}
      {referendaVotes.length <= 0 ? <EmptyList type="votes" /> : null}
    </ListWrapper>
  );
}
