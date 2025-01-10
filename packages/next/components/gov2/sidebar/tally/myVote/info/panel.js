import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import MyVoteTitle from "next-common/components/myReferendumVote/title";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import useIsProxySet from "next-common/hooks/useIsProxySet";
import HintMessage from "next-common/components/styled/hintMessage";
import MyVoteActions from "./actions";
import { memo } from "react";

function VotePanel({ type, votes }) {
  const isProxySet = useIsProxySet();

  return (
    <SecondaryCardDetail>
      <MyVoteTitle type={type} />
      <div className="flex flex-col gap-[16px]">
        <div>
          {votes.map((vote, i) => (
            <VoteItem key={i} vote={vote} />
          ))}
        </div>

        {isProxySet && <HintMessage>Votes of proxied account</HintMessage>}
        <MyVoteActions />
      </div>
    </SecondaryCardDetail>
  );
}

export default memo(VotePanel);
