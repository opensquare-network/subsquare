import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { cn } from "next-common/utils";
import { useSubFellowshipVote } from "next-common/utils/hooks/fellowship/useFellowshipVote";
import VoteButton from "./voteButton";

function MyVote({ referendumIndex }) {
  const realAddress = useRealAddress();
  const { result: myVote } = useSubFellowshipVote(referendumIndex, realAddress);
  const vote = myVote?.toJSON();

  if (!vote) {
    return null;
  }

  const tooltipContent = (
    <ul>
      <li>Vote: {"aye" in vote ? "Aye" : "Nay"}</li>
      <li>Votes: {"aye" in vote ? vote.aye : vote.nay}</li>
    </ul>
  );

  return (
    <Tooltip content={tooltipContent}>
      <div className="p-[4px]">
        <div
          className={cn(
            "w-[6px] h-[6px] rounded-full",
            vote.aye ? "bg-green500" : "bg-red500",
          )}
        />
      </div>
    </Tooltip>
  );
}

export default function ReferendumVoteButtons({ referendumIndex }) {
  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <MyVote referendumIndex={referendumIndex} />

      <VoteButton referendumIndex={referendumIndex} voteAye={false}>
        <SystemVoteNay className="w-[16px]" />
      </VoteButton>

      <VoteButton referendumIndex={referendumIndex} voteAye={true}>
        <SystemVoteAye className="w-[16px]" />
      </VoteButton>
    </div>
  );
}
