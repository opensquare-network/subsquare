import { useOnchainData } from "next-common/context/post";
import { memo } from "react";
import StandardVotePanel from "./standard";
import SplitVotePanel from "./split";

function DirectVoteInfo({ direct }) {
  const { referendumIndex } = useOnchainData();
  const votes = direct?.votes || [];
  const voteItem = votes.find((item) => item[0].toNumber() === referendumIndex);
  if (!voteItem) {
    return null;
  }

  const vote = voteItem[1];
  if (vote.isStandard) {
    return (
      <StandardVotePanel
        standard={vote.asStandard}
        delegations={direct.delegations}
      />
    );
  } else if (vote.isSplit) {
    return <SplitVotePanel split={vote.asSplit} />;
  }

  return null;
}

export default memo(DirectVoteInfo);
