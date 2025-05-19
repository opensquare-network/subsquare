import useRealAddress from "next-common/utils/hooks/useRealAddress";
import VoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/voteButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import { usePromotionButtonState } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createPromotionReferendumAndVoteButtons";
import { useRetentionButtonState } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createRetentionReferendumAndVoteButtons";
import CreateRetentionReferendumAndVoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createRetentionReferendumAndVoteButton";
import CreatePromotionReferendumAndVoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createPromotionReferendumAndVoteButton";

function AyeButton({ disabled, onClick }) {
  return (
    <PrimaryButton
      className={cn("!bg-green500", disabled && "opacity-40")}
      disabled={disabled}
      onClick={onClick}
    >
      Aye
    </PrimaryButton>
  );
}

function NayButton({ disabled, onClick }) {
  return (
    <PrimaryButton
      className={cn("!bg-red500", disabled && "opacity-40")}
      disabled={disabled}
      onClick={onClick}
    >
      Nay
    </PrimaryButton>
  );
}

export function ReferendumVoteButtons({ referendumIndex }) {
  const dispatch = useDispatch();
  const realAddress = useRealAddress();

  if (!realAddress) {
    return (
      <div className="flex gap-[8px] items-center justify-end">
        <Tooltip content="Please connect your wallet to vote">
          <AyeButton disabled={true} />
        </Tooltip>
        <Tooltip content="Please connect your wallet to vote">
          <NayButton disabled={true} />
        </Tooltip>
      </div>
    );
  }

  return (
    <div className="flex gap-[8px] items-center justify-end">
      <VoteButton
        referendumIndex={referendumIndex}
        voteAye={true}
        ButtonComponent={AyeButton}
        callbacks={{
          onInBlock: () => {
            dispatch(newSuccessToast("Vote successfully"));
          },
        }}
      ></VoteButton>

      <VoteButton
        referendumIndex={referendumIndex}
        voteAye={false}
        ButtonComponent={NayButton}
        callbacks={{
          onInBlock: () => {
            dispatch(newSuccessToast("Vote successfully"));
          },
        }}
      ></VoteButton>
    </div>
  );
}

export function CreatePromotionReferendumAndVoteButtons({ who }) {
  const { tooltipContent, disabled } = usePromotionButtonState(who);

  return (
    <div className="flex gap-[12px] items-center">
      <CreatePromotionReferendumAndVoteButton
        who={who}
        voteAye={true}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={AyeButton}
      ></CreatePromotionReferendumAndVoteButton>

      <CreatePromotionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={NayButton}
      ></CreatePromotionReferendumAndVoteButton>
    </div>
  );
}

export function CreateRetentionReferendumAndVoteButtons({ who }) {
  const { tooltipContent, disabled } = useRetentionButtonState(who);

  return (
    <div className="flex gap-[12px] items-center">
      <CreateRetentionReferendumAndVoteButton
        who={who}
        voteAye={true}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={AyeButton}
      ></CreateRetentionReferendumAndVoteButton>

      <CreateRetentionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={NayButton}
      ></CreateRetentionReferendumAndVoteButton>
    </div>
  );
}
