import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import CreateReferendumAndVoteButton from "./createReferendumAndVoteButton";
import useCollectiveMember from "../../../hooks/useCollectiveMember";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import {
  getMinRankOfClass,
  getTrackToPromoteRank,
  getTrackToRetainRank,
} from "next-common/context/post/fellowship/useMaxVoters";
import { useRankedCollectivePallet } from "next-common/context/collectives/collectives";

export default function VoteButtonsWithoutReferendum({ who, action }) {
  const collectivePallet = useRankedCollectivePallet();
  const realAddress = useRealAddress();
  const me = useCollectiveMember(realAddress);
  const myRank = me?.rank;
  const targetMember = useCollectiveMember(who);
  const rank = targetMember?.rank;

  let tooltipContent = "Create a new referendum and vote";
  let disabled = false;
  if (rank <= 0 && action === "approve") {
    tooltipContent = "Rank retention is not allowed for candidates";
    disabled = true;
  } else if (rank >= 6 && action === "promote") {
    tooltipContent =
      "There are no corresponding tracks to promote members with rank >= 6";
    disabled = true;
  } else if (myRank < 3) {
    tooltipContent = "Only rank >=3 can create a referendum and then vote";
    disabled = true;
  } else {
    if (action === "approve") {
      const trackId = getTrackToRetainRank(rank);
      const requiredRank = getMinRankOfClass(trackId, collectivePallet);
      if (requiredRank > myRank) {
        tooltipContent = `Only rank >=${requiredRank} can create a referendum and then vote`;
        disabled = true;
      }
    } else if (action === "promote") {
      const trackId = getTrackToPromoteRank(rank + 1);
      const requiredRank = getMinRankOfClass(trackId, collectivePallet);
      if (requiredRank > myRank) {
        tooltipContent = `Only rank >=${requiredRank} can create a referendum and then vote`;
        disabled = true;
      }
    }
  }

  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <CreateReferendumAndVoteButton
        address={who}
        rank={rank}
        myRank={myRank}
        action={action}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
      >
        <SystemVoteNay className="w-[16px]" />
      </CreateReferendumAndVoteButton>

      <CreateReferendumAndVoteButton
        address={who}
        rank={rank}
        myRank={myRank}
        action={action}
        voteAye={true}
        disabled={disabled}
        tooltip={tooltipContent}
      >
        <SystemVoteAye className="w-[16px]" />
      </CreateReferendumAndVoteButton>
    </div>
  );
}
