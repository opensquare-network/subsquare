import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import Tooltip from "next-common/components/tooltip";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { cn } from "next-common/utils";
import { useSubFellowshipVote } from "next-common/utils/hooks/fellowship/useFellowshipVote";
import VoteButton from "./voteButton";
import SecondaryButton from "next-common/lib/button/secondary";
import { useMyVotesChangedContext } from "../../../context/myVotesChanged";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";

export function MyVote({ referendumIndex }) {
  const realAddress = useRealAddress();
  const { result: myVote } = useSubFellowshipVote(referendumIndex, realAddress);
  const vote = myVote?.toJSON();

  if (!vote) {
    return null;
  }

  const tooltipContent = (
    <ul>
      <li>My Vote: {"aye" in vote ? "Aye" : "Nay"}</li>
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

export function SecondaryButtonWrapper({ disabled, onClick, children }) {
  return (
    <SecondaryButton
      disabled={disabled}
      className={cn("p-[6px]", disabled && "[&_svg_path]:stroke-textDisabled")}
      size="small"
      onClick={onClick}
    >
      {children}
    </SecondaryButton>
  );
}

export default function ReferendumVoteButtons({ referendumIndex }) {
  const dispatch = useDispatch();
  const { triggerMyVotesChanged } = useMyVotesChangedContext();

  return (
    <div className="flex gap-[12px] h-[31px] items-center justify-end">
      <MyVote referendumIndex={referendumIndex} />

      <VoteButton
        referendumIndex={referendumIndex}
        voteAye={false}
        ButtonComponent={SecondaryButtonWrapper}
        callbacks={{
          onInBlock: () => {
            dispatch(newSuccessToast("Vote successfully"));
            triggerMyVotesChanged();
          },
          onFinalized: () => {
            triggerMyVotesChanged();
          },
        }}
      >
        <SystemVoteNay className="w-[16px]" />
      </VoteButton>

      <VoteButton
        referendumIndex={referendumIndex}
        voteAye={true}
        ButtonComponent={SecondaryButtonWrapper}
        callbacks={{
          onInBlock: () => {
            dispatch(newSuccessToast("Vote successfully"));
            triggerMyVotesChanged();
          },
          onFinalized: () => {
            triggerMyVotesChanged();
          },
        }}
      >
        <SystemVoteAye className="w-[16px]" />
      </VoteButton>
    </div>
  );
}
