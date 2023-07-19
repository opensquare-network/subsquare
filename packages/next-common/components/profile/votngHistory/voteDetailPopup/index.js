import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import { StandardVoteDetail } from "./standardVoteDetail";
import { SplitVoteDetail } from "./splitVoteDetail";
import { SplitAbstainVoteDetail } from "./splitAbstainDetail";

export default function VoteDetailPopup({ vote, setShowVoteDetail }) {
  let voteDetail = null;

  if (vote.isStandard) {
    voteDetail = <StandardVoteDetail />;
  } else if (vote.isSplit) {
    voteDetail = <SplitVoteDetail />;
  } else if (vote.isSplitAbstain) {
    voteDetail = <SplitAbstainVoteDetail />;
  }

  return (
    <BaseVotesPopup
      wide
      title="Vote Detail"
      onClose={() => setShowVoteDetail(null)}
    >
      {voteDetail}
    </BaseVotesPopup>
  );
}
