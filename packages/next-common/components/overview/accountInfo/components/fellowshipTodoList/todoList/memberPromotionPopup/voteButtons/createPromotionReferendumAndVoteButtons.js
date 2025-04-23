import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import CreatePromotionReferendumAndVoteButton from "./createPromotionReferendumAndVoteButton";
import {
  getMinRankOfClass,
  getTrackToPromoteToRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";
import useMyRank from "./useMyRank";
import useMemberRank from "./useMemberRank";
import { SecondaryButtonWrapper } from "./referendumVoteButtons";
import { isNil } from "lodash-es";

export function usePromotionButtonState(who) {
  const collectivePallet = useRankedCollectivePallet();
  const myRank = useMyRank();
  const currentRank = useMemberRank(who);

  let tooltipContent = "Create a new referendum and vote";
  let disabled = false;
  if (currentRank >= 6) {
    tooltipContent =
      "There are no corresponding tracks to promote members with rank >= 6";
    disabled = true;
  } else if (isNil(myRank) || myRank < 3) {
    tooltipContent = "Only rank >= 3 can create a referendum and then vote";
    disabled = true;
  } else {
    const trackId = getTrackToPromoteToRank(currentRank + 1);
    const requiredRank = getMinRankOfClass(trackId, collectivePallet);
    if (requiredRank > myRank) {
      tooltipContent = `Only rank >= ${requiredRank} can create a referendum and then vote`;
      disabled = true;
    }
  }

  return {
    tooltipContent,
    disabled,
  };
}

export default function CreatePromotionReferendumAndVoteButtons({ who }) {
  const { tooltipContent, disabled } = usePromotionButtonState(who);

  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <CreatePromotionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={SecondaryButtonWrapper}
      >
        <SystemVoteNay className="w-[16px]" />
      </CreatePromotionReferendumAndVoteButton>

      <CreatePromotionReferendumAndVoteButton
        who={who}
        voteAye={true}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={SecondaryButtonWrapper}
      >
        <SystemVoteAye className="w-[16px]" />
      </CreatePromotionReferendumAndVoteButton>
    </div>
  );
}
