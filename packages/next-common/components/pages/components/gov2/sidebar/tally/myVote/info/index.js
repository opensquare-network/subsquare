import { useSharedMyReferendumVote } from "next-common/context/referenda/myVote";
import { useOnchainData, usePost } from "next-common/context/post";
import StandardVotePanel from "./standard";
import SplitVotePanel from "./split";
import SplitAbstainVotePanel from "./splitAbstain";
import MyReferendumDelegatingTargetVoteProvider from "next-common/context/referenda/myVote/delegating";
import DelegatedVotePanel from "./delegated";
import { memo } from "react";

function CastingVoteInfo({ casting }) {
  const { referendumIndex } = useOnchainData();
  const votes = casting?.votes || [];
  const voteItem = votes.find((item) => item[0].toNumber() === referendumIndex);
  if (!voteItem) {
    return null;
  }

  const vote = voteItem[1];
  if (vote.isStandard) {
    return (
      <StandardVotePanel
        standard={vote.asStandard}
        delegations={casting.delegations}
      />
    );
  } else if (vote.isSplit) {
    return <SplitVotePanel split={vote.asSplit} />;
  } else if (vote.isSplitAbstain) {
    return <SplitAbstainVotePanel splitAbstain={vote.asSplitAbstain} />;
  } else {
    return null;
  }
}

const MemoCastingVoteInfo = memo(CastingVoteInfo);

function DelegatingVoteInfo({ delegating }) {
  if (!delegating) {
    throw new Error("No delegating data for DelegatingVoteInfo");
  }

  const post = usePost();
  const trackId = post?.track;

  const target = delegating.target.toString();
  return (
    <MyReferendumDelegatingTargetVoteProvider trackId={trackId} target={target}>
      <DelegatedVotePanel delegating={delegating} />
    </MyReferendumDelegatingTargetVoteProvider>
  );
}

const MemoDelegatingVoteInfo = memo(DelegatingVoteInfo);

export default function MyVoteOnActiveReferendum() {
  const [voting] = useSharedMyReferendumVote();

  if (!voting) {
    return null;
  } else if (voting.isCasting) {
    return <MemoCastingVoteInfo casting={voting.asCasting} />;
  } else if (voting.isDelegating) {
    return <MemoDelegatingVoteInfo delegating={voting.asDelegating} />;
  }
}
