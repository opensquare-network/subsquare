import useIsProxySet from "next-common/hooks/useIsProxySet";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import MyVoteTitle from "next-common/components/myReferendumVote/title";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import DelegationStatus from "next-common/components/myReferendumVote/delegationStatus";
import HintMessage from "next-common/components/styled/hintMessage";
import MyVoteActions from "./actions";
import { memo } from "react";

export function DelegatingVotePanel({ aye, target, balance, conviction }) {
  const isProxySet = useIsProxySet();

  const vote = {
    isDelegating: true,
    target,
    conviction,
    balance,
    aye,
  };

  return (
    <SecondaryCardDetail>
      <MyVoteTitle type="Delegating" />
      <div className="flex flex-col gap-[16px]">
        <VoteItem vote={vote} />

        <DelegationStatus delegatingTarget={target} />
        {isProxySet && <HintMessage>Votes of proxied account</HintMessage>}
        <MyVoteActions remove={false} />
      </div>
    </SecondaryCardDetail>
  );
}

export default memo(DelegatingVotePanel);
