import { useSelector } from "react-redux";
import { myDemocracyDelegatedVotesSelector } from "next-common/store/reducers/myOnChainData/democracy/selectors/delegated";
import ListWrapper from "../../mobile/listWrapper";
import { ListCard } from "../../styled";
import {
  PostTitle,
  VoteItem,
} from "next-common/components/profile/votingHistory/common";
import { myDemocracyVotingSelector } from "next-common/store/reducers/myOnChainData/democracy/myDemocracyVoting";
import VoteItemGuard from "./voteItemGuard";
import { DelegatedVoteLock } from "./voteForItem";
import getPostTitle from "./getPostTitle";
import DemocracyTag from "../stateTag";
import DelegationHint from "./hint";
import ProxyHint from "../../proxyHint";
import { EmptyList } from "next-common/components/emptyList";

function ItemHeader({ vote }) {
  return (
    <>
      <div className="flex items-center justify-between pb-[12px] border-b border-b-neutral300">
        <PostTitle
          referendumIndex={vote.referendumIndex}
          title={getPostTitle(vote)}
        />
      </div>
      <div className="flex justify-end pt-[12px] items-center">
        <DemocracyTag
          key="tag"
          post={vote.post}
          onchainInfo={vote.referendumInfo}
        />
      </div>
    </>
  );
}

function VoteListItem({ vote }) {
  const voting = useSelector(myDemocracyVotingSelector);
  const { balance, conviction } = voting || {};
  const { aye } = vote.vote || {};

  return (
    <ListCard>
      <ItemHeader vote={vote} />
      <VoteItemGuard targetVote={vote.vote}>
        <div className="flex flex-col mt-[24px] gap-2">
          <VoteItem
            key="vote"
            vote={{ balance, conviction, aye, isDelegating: true }}
          />
          <DelegatedVoteLock
            referendumInfo={vote.referendumInfo}
            targetVote={vote.vote}
          />
        </div>
      </VoteItemGuard>
    </ListCard>
  );
}

export default function MobileList() {
  const myDelegatedVotes = useSelector(myDemocracyDelegatedVotesSelector);

  return (
    <ListWrapper isLoading={!myDelegatedVotes}>
      <ProxyHint />
      <DelegationHint />
      {(myDelegatedVotes || []).map((item) => (
        <VoteListItem key={item.referendumIndex} vote={item} />
      ))}
      {(myDelegatedVotes || []).length <= 0 ? <EmptyList type="votes" /> : null}
    </ListWrapper>
  );
}
