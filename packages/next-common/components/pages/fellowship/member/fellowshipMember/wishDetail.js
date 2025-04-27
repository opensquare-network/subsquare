import Divider from "next-common/components/styled/layout/divider";
import { IpfsEvidenceRawContent } from "next-common/components/collectives/core/evidenceContent";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import { WishBar } from "./wishBar";
import { useFellowshipCoreRelatedReferenda } from "next-common/components/collectives/core/member/relatedReferenda";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import FellowshipReferendumTitle from "next-common/components/fellowshipReferendumTitle";
import VoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/voteButton";
import { useDispatch } from "react-redux";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import PrimaryButton from "next-common/lib/button/primary";
import Tooltip from "next-common/components/tooltip";
import { cn } from "next-common/utils";
import MyVote from "./myVote";
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

function ReferendumVote({ referendumIndex, referendum }) {
  const trackId = referendum?.track?.toNumber();

  return (
    <div className="flex items-center justify-between text14Medium">
      <div className="flex flex-col gap-[4px]">
        <FellowshipReferendumTitle
          referendumIndex={referendumIndex}
          trackId={trackId}
        />
        <MyVote referendumIndex={referendumIndex} />
      </div>
      <ReferendumVoteButtons referendumIndex={referendumIndex} />
    </div>
  );
}

function CreatePromotionReferendumAndVoteButtons({ who }) {
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

function CreateReferendumAndVote({ who, wish }) {
  if (wish.toLowerCase() === "promotion") {
    return (
      <div className="flex items-center justify-end text14Medium">
        <CreatePromotionReferendumAndVoteButtons who={who} />
      </div>
    );
  } else if (wish.toLowerCase() === "retention") {
    return (
      <div className="flex items-center justify-end text14Medium">
        <CreateRetentionReferendumAndVoteButtons who={who} />
      </div>
    );
  }

  return null;
}

function VoteBar({ address, wish }) {
  const { relatedReferenda, isLoading } =
    useFellowshipCoreRelatedReferenda(address);

  if (isLoading) {
    return null;
  }

  if (relatedReferenda.length > 0) {
    return (
      <div className="flex flex-col gap-[16px]">
        {relatedReferenda.map((referendum, index) => (
          <ReferendumVote key={index} {...referendum} />
        ))}
      </div>
    );
  }

  return <CreateReferendumAndVote who={address} wish={wish} />;
}

function WishPanel({ address, activeMember }) {
  const { loading, wish } = useSubCoreFellowshipEvidence(address);

  if (loading) {
    return null;
  }

  return (
    <div className="flex flex-col gap-[16px]">
      <WishBar wish={wish} activeMember={activeMember} address={address} />
      <VoteBar address={address} wish={wish} />
    </div>
  );
}

export default function WishDetail({ activeMember, address, ifpsContent }) {
  return (
    <div className="gap-y-4 flex flex-col">
      <WishPanel address={address} activeMember={activeMember} />
      <Divider />
      <IpfsEvidenceRawContent key="detail-content" value={ifpsContent} />
    </div>
  );
}
