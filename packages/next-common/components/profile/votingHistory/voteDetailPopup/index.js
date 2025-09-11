import BaseVotesPopup from "next-common/components/popup/baseVotesPopup";
import { StandardVoteDetail } from "./standardVoteDetail";
import { SplitVoteDetail } from "./splitVoteDetail";
import { SplitAbstainVoteDetail } from "./splitAbstainDetail";

export default function VoteDetailPopup({ vote, setShowVoteDetail }) {
  let voteDetail = null;

  if (vote.isStandard || vote.isDelegating) {
    voteDetail = <StandardVoteDetail vote={vote} />;
  } else if (vote.isSplit) {
    voteDetail = <SplitVoteDetail vote={vote} />;
  } else if (vote.isSplitAbstain) {
    voteDetail = <SplitAbstainVoteDetail vote={vote} />;
  }

  return (
    <BaseVotesPopup title="Vote Detail" onClose={() => setShowVoteDetail(null)}>
      {voteDetail}
    </BaseVotesPopup>
  );
}
