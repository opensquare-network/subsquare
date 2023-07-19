import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import { StandardVoteDetail } from "./standardVoteDetail";
import { SplitVoteDetail } from "./splitVoteDetail";
import { SplitAbstainVoteDetail } from "./splitAbstainDetail";

export default function VoteDetailPopup({ vote, isGov2, setShowVoteDetail }) {
  let voteDetail = null;

  if (vote.isStandard) {
    voteDetail = <StandardVoteDetail vote={vote} isGov2={isGov2} />;
  } else if (vote.isSplit) {
    voteDetail = <SplitVoteDetail vote={vote} />;
  } else if (vote.isSplitAbstain) {
    voteDetail = <SplitAbstainVoteDetail vote={vote} />;
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
