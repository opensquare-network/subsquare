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

export function ReferendumIndex({ referendumIndex }) {
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

export function ReferendumVoteButtons({ referendumIndex, size = 16 }) {
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
        <SystemVoteAye style={{ width: size, height: size }} />
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
        <SystemVoteNay style={{ width: size, height: size }} />
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

export function ReferendumIndexAndMyVote({ referendumIndex }) {
  return (
    <div className="flex items-center gap-[4px]">
      <ReferendumIndex referendumIndex={referendumIndex} />
      <MyVote referendumIndex={referendumIndex} />
    </div>
  );
}

function ReferendaListWithActions({ relatedReferenda, size }) {
  return (
    <div className="flex flex-col">
      {relatedReferenda.map(({ referendumIndex }, index) => (
        <div key={index} className="flex items-center gap-[8px]">
          <ReferendumIndexAndMyVote referendumIndex={referendumIndex} />
          <span className="text-textTertiary">·</span>
          <ReferendumVoteButtons
            referendumIndex={referendumIndex}
            size={size}
          />
        </div>
      ))}
    </div>
  );
}

function CreatePromotionReferendumAndVoteButtons({ who, size = 16 }) {
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
        <SystemVoteAye style={{ width: size, height: size }} />
      </CreatePromotionReferendumAndVoteButton>

      <CreatePromotionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={SimpleButton}
      >
        <SystemVoteNay style={{ width: size, height: size }} />
      </CreatePromotionReferendumAndVoteButton>
    </div>
  );
}

export function CreateRetentionReferendumAndVoteButtons({ who, size = 16 }) {
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
        <SystemVoteAye style={{ width: size, height: size }} />
      </CreateRetentionReferendumAndVoteButton>

      <CreateRetentionReferendumAndVoteButton
        who={who}
        voteAye={false}
        disabled={disabled}
        tooltip={tooltipContent}
        ButtonComponent={SimpleButton}
      >
        <SystemVoteNay style={{ width: size, height: size }} />
      </CreateRetentionReferendumAndVoteButton>
    </div>
  );
}

function CreateReferendumAndVote({ who, pallet, size }) {
  const { wish } = useSubCoreFellowshipEvidence(who, pallet);

  if (wish.toLowerCase() === "promotion") {
    return <CreatePromotionReferendumAndVoteButtons who={who} size={size} />;
  } else if (wish.toLowerCase() === "retention") {
    return <CreateRetentionReferendumAndVoteButtons who={who} size={size} />;
  }

  return <span className="text-textDisabled">-</span>;
}

export function CoreFellowshipMemberRelatedReferendaActionsContent({
  pallet,
  who,
  relatedReferenda,
  isLoading,
  size = 16,
}) {
  const realAddress = useRealAddress();

  if (isLoading) {
    return <FieldLoading size={size} />;
  }

  if (realAddress) {
    if (relatedReferenda.length > 0) {
      return (
        <ReferendaListWithActions
          relatedReferenda={relatedReferenda}
          size={size}
        />
      );
    }
    return <CreateReferendumAndVote who={who} pallet={pallet} size={size} />;
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
