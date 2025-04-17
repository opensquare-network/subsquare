import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import CreatePromotionReferendumAndVoteButton from "./createPromotionReferendumAndVoteButton";
import useCollectiveMember from "../../../hooks/useCollectiveMember";
import {
  getMinRankOfClass,
  getTrackToPromoteToRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import useMyRank from "./useMyRank";

export default function CreatePromotionReferendumAndVoteButtons({ who }) {
  const collectivePallet = useRankedCollectivePallet();
  const myRank = useMyRank();
  const targetMember = useCollectiveMember(who);
  const currentRank = targetMember?.rank;

  let tooltipContent = "Create a new referendum and vote";
  let disabled = false;
  if (currentRank >= 6) {
    tooltipContent =
      "There are no corresponding tracks to promote members with rank >= 6";
    disabled = true;
  } else if (myRank < 3) {
    tooltipContent = "Only rank >=3 can create a referendum and then vote";
    disabled = true;
  } else {
    const trackId = getTrackToPromoteToRank(currentRank + 1);
    const requiredRank = getMinRankOfClass(trackId, collectivePallet);
    if (requiredRank > myRank) {
      tooltipContent = `Only rank >= ${requiredRank} can create a referendum and then vote`;
      disabled = true;
    }
  }

  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <CreatePromotionReferendumAndVoteButton
        address={who}
        currentRank={currentRank}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
      >
        <SystemVoteNay className="w-[16px]" />
      </CreatePromotionReferendumAndVoteButton>

      <CreatePromotionReferendumAndVoteButton
        address={who}
        currentRank={currentRank}
        voteAye={true}
        disabled={disabled}
        tooltip={tooltipContent}
      >
        <SystemVoteAye className="w-[16px]" />
      </CreatePromotionReferendumAndVoteButton>
    </div>
  );
}
