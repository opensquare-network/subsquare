import { useOnchainData } from "next-common/context/post";
import { memo } from "react";

function DirectVoteInfo({ direct }) {
  const { referendumIndex } = useOnchainData();
  const votes = direct?.votes || [];
  const voteItem = votes.find((item) => item[0].toNumber() === referendumIndex);
  if (!voteItem) {
    return null;
  }

  const vote = voteItem[1];
  if (vote.isStandard) {
    console.log("standard", vote.asStandard);
  }
  return null;
}

export default memo(DirectVoteInfo);
