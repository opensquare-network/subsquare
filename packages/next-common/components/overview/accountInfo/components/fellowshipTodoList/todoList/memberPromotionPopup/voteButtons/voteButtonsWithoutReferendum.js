import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import CreateReferendumAndVoteButton from "./createReferendumAndVoteButton";
import useCollectiveMember from "../../../hooks/useCollectiveMember";
import Tooltip from "next-common/components/tooltip";
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
    tooltipContent = "Create a new referendum and vote";
    disabled = false;
  } else {
    tooltipContent = "Only rank >=3 can create a referendum and then vote";
    disabled = true;
  }

  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <Tooltip content={tooltipContent}>
        <CreateReferendumAndVoteButton
          address={who}
          rank={rank}
          action={action}
          voteAye={false}
          disabled={disabled}
        >
          <SystemVoteNay className="w-[16px]" />
        </CreateReferendumAndVoteButton>
      </Tooltip>

      <Tooltip content={tooltipContent}>
        <CreateReferendumAndVoteButton
          address={who}
          rank={rank}
          action={action}
          voteAye={true}
          disabled={disabled}
        >
          <SystemVoteAye className="w-[16px]" />
        </CreateReferendumAndVoteButton>
      </Tooltip>
    </div>
  );
}
