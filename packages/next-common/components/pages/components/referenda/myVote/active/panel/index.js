import useIsProxySet from "next-common/hooks/useIsProxySet";
import { SecondaryCardDetail } from "next-common/components/styled/containers/secondaryCard";
import MyVoteTitle from "next-common/components/myReferendumVote/title";
import { VoteItem } from "next-common/components/myReferendumVote/voteItem";
import Delegations from "../../../../gov2/sidebar/tally/myVote/info/delegations";
import HintMessage from "next-common/components/styled/hintMessage";
import { memo } from "react";
import MyVoteActions from "next-common/components/common/myVote/actions";
import { Democracy } from "next-common/components/profile/votingHistory/common";

function VotePanel({ type, votes, delegations }) {
  const isProxySet = useIsProxySet();

  return (
    <SecondaryCardDetail>
      <MyVoteTitle type={type} />
      <div className="flex flex-col gap-[16px]">
        <div>
          {votes.map((vote, i) => (
            <VoteItem key={i} vote={vote} />
          ))}
          {delegations && (
            <Delegations delegations={delegations.votes.toString()} />
          )}
        </div>

        {isProxySet && <HintMessage>Votes of proxied account</HintMessage>}
        <MyVoteActions type={Democracy} />
      </div>
    </SecondaryCardDetail>
  );
}

export default memo(VotePanel);
