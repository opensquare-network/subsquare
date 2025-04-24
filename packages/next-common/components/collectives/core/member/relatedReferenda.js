import { Fragment } from "react";
import Link from "next/link";
import { useCollectivesContext } from "next-common/context/collectives/collectives";
import CoreFellowshipMemberInfoWrapper from "./infoWrapper";
import CoreFellowshipMemberInfoTitle from "./title";
import useFetch from "next-common/hooks/useFetch";
import Tooltip from "next-common/components/tooltip";
import { getGov2ReferendumTitle } from "next-common/utils/gov2/title";
import useRelatedReferenda from "next-common/hooks/fellowship/useRelatedReferenda";
import FieldLoading from "next-common/components/icons/fieldLoading";
import { MyVote } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/referendumVoteButtons";
import VoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/voteButton";
import { SystemVoteAye, SystemVoteNay } from "@osn/icons/subsquare";
import { cn } from "next-common/utils";
import useRealAddress from "next-common/utils/hooks/useRealAddress";
import { newSuccessToast } from "next-common/store/reducers/toastSlice";
import { useDispatch } from "react-redux";
import CreatePromotionReferendumAndVoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createPromotionReferendumAndVoteButton";
import { usePromotionButtonState } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createPromotionReferendumAndVoteButtons";
import { useRetentionButtonState } from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createRetentionReferendumAndVoteButtons";
import useSubCoreFellowshipEvidence from "next-common/hooks/collectives/useSubCoreFellowshipEvidence";
import CreateRetentionReferendumAndVoteButton from "next-common/components/overview/accountInfo/components/fellowshipTodoList/todoList/memberPromotionPopup/voteButtons/createRetentionReferendumAndVoteButton";

const methods = ["bump", "approve", "promote", "promoteFast"];

export function useFellowshipCoreRelatedReferenda(address) {
  return useRelatedReferenda(address, methods);
}

function ReferendumTooltip({ referendumIndex, children }) {
  const { section } = useCollectivesContext();
  const { value } = useFetch(`/api/${section}/referenda/${referendumIndex}`);
  if (!value) {
    return children;
  }
  const title = getGov2ReferendumTitle(value);
  return (
    <Tooltip content={`#${referendumIndex} · ${title}`}>{children}</Tooltip>
  );
}

function ReferendumIndex({ referendumIndex }) {
  const { section } = useCollectivesContext();

  return (
    <ReferendumTooltip referendumIndex={referendumIndex}>
      <Link href={`/${section}/referenda/${referendumIndex}`}>
        <span className="cursor-pointer text-sapphire500">
          #{referendumIndex}
        </span>
      </Link>
    </ReferendumTooltip>
  );
}

function SimpleButton({ disabled, onClick, children }) {
  return (
    <div
      role="button"
      className={cn(
        disabled && "pointer-events-none [&_svg_path]:stroke-textDisabled",
      )}
      onClick={onClick}
    >
      {children}
    </div>
  );
}

export function ReferendumVoteButtons({ referendumIndex }) {
  const dispatch = useDispatch();
  return (
    <div className="flex gap-[12px] items-center justify-end">
      <VoteButton
        referendumIndex={referendumIndex}
        voteAye={true}
        ButtonComponent={SimpleButton}
        callbacks={{
          onInBlock: () => {
            dispatch(newSuccessToast("Vote successfully"));
          },
        }}
      >
        <SystemVoteAye className="w-[16px] h-[16px]" />
      </VoteButton>

      <VoteButton
        referendumIndex={referendumIndex}
        voteAye={false}
        ButtonComponent={SimpleButton}
        callbacks={{
          onInBlock: () => {
            dispatch(newSuccessToast("Vote successfully"));
          },
        }}
      >
        <SystemVoteNay className="w-[16px] h-[16px]" />
      </VoteButton>
    </div>
  );
}

function ReferendaList({ relatedReferenda }) {
  return relatedReferenda.map(({ referendumIndex }, index) => (
    <Fragment key={index}>
      {index !== 0 && <span className="text-textTertiary">·</span>}
      <ReferendumIndex referendumIndex={referendumIndex} />
    </Fragment>
  ));
}

function ReferendaListWithActions({ relatedReferenda }) {
  return (
    <div className="flex flex-col">
      {relatedReferenda.map(({ referendumIndex }, index) => (
        <div key={index} className="flex items-center gap-[8px]">
          <div className="flex items-center gap-[4px]">
            <ReferendumIndex referendumIndex={referendumIndex} />
            <MyVote referendumIndex={referendumIndex} />
          </div>
          <span className="text-textTertiary">·</span>
          <ReferendumVoteButtons referendumIndex={referendumIndex} />
        </div>
      ))}
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
        ButtonComponent={SimpleButton}
      >
        <SystemVoteAye className="w-[16px] h-[16px]" />
      </CreatePromotionReferendumAndVoteButton>

      <CreatePromotionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={SimpleButton}
      >
        <SystemVoteNay className="w-[16px] h-[16px]" />
      </CreatePromotionReferendumAndVoteButton>
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
        ButtonComponent={SimpleButton}
      >
        <SystemVoteAye className="w-[16px] h-[16px]" />
      </CreateRetentionReferendumAndVoteButton>

      <CreateRetentionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={SimpleButton}
      >
        <SystemVoteNay className="w-[16px] h-[16px]" />
      </CreateRetentionReferendumAndVoteButton>
    </div>
  );
}

function CreateReferendumAndVote({ who, pallet }) {
  const { wish } = useSubCoreFellowshipEvidence(who, pallet);

  if (wish.toLowerCase() === "promotion") {
    return <CreatePromotionReferendumAndVoteButtons who={who} />;
  } else if (wish.toLowerCase() === "retention") {
    return <CreateRetentionReferendumAndVoteButtons who={who} />;
  }

  return <span className="text-textDisabled">-</span>;
}

export function CoreFellowshipMemberRelatedReferendaContent({
  relatedReferenda,
  isLoading,
}) {
  if (isLoading) {
    return <FieldLoading size={16} />;
  }

  if (relatedReferenda.length > 0) {
    return <ReferendaList relatedReferenda={relatedReferenda} />;
  }

  return <span className="text-textDisabled">-</span>;
}

export function CoreFellowshipMemberRelatedReferendaActionsContent({
  pallet,
  who,
  relatedReferenda,
  isLoading,
}) {
  const realAddress = useRealAddress();

  if (isLoading) {
    return <FieldLoading size={16} />;
  }

  if (realAddress) {
    if (relatedReferenda.length > 0) {
      return <ReferendaListWithActions relatedReferenda={relatedReferenda} />;
    }
    return <CreateReferendumAndVote who={who} pallet={pallet} />;
  }

  if (relatedReferenda.length > 0) {
    return <ReferendaList relatedReferenda={relatedReferenda} />;
  }
  return <span className="text-textDisabled">-</span>;
}

export function CoreFellowshipMemberRelatedReferendaActions({
  address,
  pallet,
}) {
  const { relatedReferenda, isLoading } = useFellowshipCoreRelatedReferenda(
    address,
    pallet,
  );

  return (
    <CoreFellowshipMemberInfoWrapper>
      <CoreFellowshipMemberInfoTitle className="mb-0.5">
        Referenda
      </CoreFellowshipMemberInfoTitle>
      <div className="flex text12Medium gap-[4px] items-center truncate">
        <CoreFellowshipMemberRelatedReferendaActionsContent
          pallet={pallet}
          who={address}
          relatedReferenda={relatedReferenda}
          isLoading={isLoading}
        />
      </div>
    </CoreFellowshipMemberInfoWrapper>
  );
}
