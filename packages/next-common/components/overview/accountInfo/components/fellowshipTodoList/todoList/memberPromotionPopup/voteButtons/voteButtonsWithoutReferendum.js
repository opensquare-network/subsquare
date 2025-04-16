import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import CreateReferendumAndVoteButton from "./createReferendumAndVoteButton";
import useCollectiveMember from "../../../hooks/useCollectiveMember";
import useRealAddress from "next-common/utils/hooks/useRealAddress";

export default function VoteButtonsWithoutReferendum({ who, action }) {
  const realAddress = useRealAddress();
  const me = useCollectiveMember(realAddress);
  const myRank = me?.rank;
  const targetMember = useCollectiveMember(who);
  const rank = targetMember?.rank;

  let tooltipContent = "";
  let disabled = false;
  if (rank <= 0 && action === "approve") {
    tooltipContent = "Rank retention is not allowed for candidates";
    disabled = true;
  } else if (rank >= 6 && action === "promote") {
    tooltipContent =
      "There are no corresponding tracks to promote members with rank >= 6";
    disabled = true;
  } else if (myRank >= 3) {
    if (rank > myRank && action === "approve") {
      tooltipContent = `Only rank >=${rank} can create a referendum and then vote`;
      disabled = true;
    } else if (rank >= myRank && action === "promote") {
      tooltipContent = `Only rank >=${
        rank + 1
      } can create a referendum and then vote`;
      disabled = true;
    } else {
      tooltipContent = "Create a new referendum and vote";
      disabled = false;
    }
  } else {
    tooltipContent = "Only rank >=3 can create a referendum and then vote";
    disabled = true;
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
