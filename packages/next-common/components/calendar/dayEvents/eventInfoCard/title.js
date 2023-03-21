import React from "react";
import noop from "lodash.noop";
import dayjs from "dayjs";
import styled from "styled-components";
import EventTag from "./eventTag";
import FoldButton from "./foldButton";
import {
  flex,
  gap_x,
  hover,
  underline,
} from "../../../../styles/tailwindcss";
import Link from "next/link";
import TooltipOrigin from "../../../tooltip";
import { EventType, getPostUrlsByEvent } from "./utils";
import { hashEllipsis } from "../../../../utils";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;

  color: ${(p) => p.theme.textPrimary};

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const Left = styled.div`
  flex: 1;
  word-break: break-word;
  ${flex}
  ${gap_x(4)}
`;
const Right = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;
`;

const TitleTime = styled.div`
  ${hover(underline)}
`;
const TitleLink = styled.a`
  flex: 1;
  ${hover(underline)}
`;

const Tooltip = styled(TooltipOrigin)``;

function getEventTitle(event) {
  switch (event.type) {
    case EventType.TreasuryProposalProposed: {
      return `Treasury proposal #${event.proposalIndex} proposed`;
    }
    case EventType.TreasuryProposalApproved: {
      return `Treasury proposal #${event.proposalIndex} approved`;
    }
    case EventType.TreasuryProposalAwarded: {
      return `Treasury proposal #${event.proposalIndex} awarded`;
    }
    case EventType.TreasuryProposalRejected: {
      return `Treasury proposal #${event.proposalIndex} rejected`;
    }
    case EventType.TreasuryTipNew: {
      return `Treasury tip ${hashEllipsis(event.hash)} proposed`;
    }
    case EventType.TreasuryTipClosed: {
      return `Treasury tip ${hashEllipsis(event.hash)} closed`;
    }
    case EventType.TreasuryTipRetracted: {
      return `Treasury tip ${hashEllipsis(event.hash)} retracted`;
    }
    case EventType.TreasuryBountyProposed: {
      return `Treasury bounty #${event.bountyIndex} proposed`;
    }
    case EventType.TreasuryBountyAwarded: {
      return `Treasury bounty #${event.bountyIndex} awarded`;
    }
    case EventType.TreasuryBountyClaimed: {
      return `Treasury bounty #${event.bountyIndex} claimed`;
    }
    case EventType.TreasuryBountyRejected: {
      return `Treasury bounty #${event.bountyIndex} rejected`;
    }
    case EventType.TreasuryBountyApproved: {
      return `Treasury bounty #${event.bountyIndex} approved`;
    }
    case EventType.TreasuryBountyCanceled: {
      return `Treasury bounty #${event.bountyIndex} canceled`;
    }
    case EventType.TreasuryChildBountyAdded: {
      return `Treasury child bounty #${event.childBountyIndex} added`;
    }
    case EventType.TreasuryChildBountyAwarded: {
      return `Treasury child bounty #${event.childBountyIndex} awarded`;
    }
    case EventType.TreasuryChildBountyCanceled: {
      return `Treasury child bounty #${event.childBountyIndex} canceled`;
    }
    case EventType.TreasuryChildBountyClaimed: {
      return `Treasury child bounty #${event.childBountyIndex} claimed`;
    }
    case EventType.CouncilMotionProposed: {
      return `Council motion ${hashEllipsis(event.motionHash)} proposed`;
    }
    case EventType.CouncilMotionApproved: {
      return `Council motion ${hashEllipsis(event.motionHash)} approved`;
    }
    case EventType.CouncilMotionDisApproved: {
      return `Council motion ${hashEllipsis(event.motionHash)} disapproved`;
    }
    case EventType.TcMotionProposed: {
      return `Technical committee motion ${hashEllipsis(
        event.motionHash,
      )} proposed`;
    }
    case EventType.TcMotionApproved: {
      return `Technical committee motion ${hashEllipsis(
        event.motionHash,
      )} approved`;
    }
    case EventType.TcMotionDisApproved: {
      return `Technical committee motion ${hashEllipsis(
        event.motionHash,
      )} disapproved`;
    }
    case EventType.TcMotionExecuted: {
      return `Technical committee motion ${hashEllipsis(
        event.motionHash,
      )} executed`;
    }
    case EventType.AdvisoryCommitteeProposed: {
      return `Advisory committee motion ${hashEllipsis(event.hash)} proposed`;
    }
    case EventType.AdvisoryCommitteeApproved: {
      return `Advisory committee motion ${hashEllipsis(event.hash)} approved`;
    }
    case EventType.AdvisoryCommitteeDisApproved: {
      return `Advisory committee motion ${hashEllipsis(
        event.hash,
      )} disapproved`;
    }
    case EventType.DemocracyProposalProposed: {
      return `Democracy proposal #${event.proposalIndex} proposed`;
    }
    case EventType.DemocracyProposalCanceled: {
      return `Democracy proposal #${event.proposalIndex} canceled`;
    }
    case EventType.DemocracyReferendumStarted: {
      return `Democracy referendum #${event.referendumIndex} started`;
    }
    case EventType.DemocracyReferendumPassed: {
      return `Democracy referendum #${event.referendumIndex} passed`;
    }
    case EventType.DemocracyReferendumNotPassed: {
      return `Democracy referendum #${event.referendumIndex} not passed`;
    }
    case EventType.DemocracyReferendumCancelled: {
      return `Democracy referendum #${event.referendumIndex} canceled`;
    }
    case EventType.DemocracyReferendumExecuted: {
      return `Democracy referendum #${event.referendumIndex} executed`;
    }
    case EventType.DemocracyReferendumNotExecuted: {
      return `Democracy referendum #${event.referendumIndex} not executed`;
    }
    case EventType.DemocracyReferendumFastTrack: {
      return `Democracy referendum #${event.referendumIndex} fast tracked`;
    }
    case EventType.ReferendaSubmitted: {
      return `Referenda #${event.index} submitted`;
    }
    case EventType.ReferendaDecisionStarted: {
      return `Referenda #${event.index} decision started`;
    }
    case EventType.ReferendaConfirmStarted: {
      return `Referenda #${event.index} confirm started`;
    }
    case EventType.ReferendaConfirmAborted: {
      return `Referenda #${event.index} confirm aborted`;
    }
    case EventType.ReferendaConfirmed: {
      return `Referenda #${event.index} confirmed`;
    }
    case EventType.ReferendaCancelled: {
      return `Referenda #${event.index} canceled`;
    }
    case EventType.ReferendaKilled: {
      return `Referenda #${event.index} killed`;
    }
    case EventType.ReferendaTimedout: {
      return `Referenda #${event.index} timed out`;
    }
    case EventType.ReferendaRejected: {
      return `Referenda #${event.index} rejected`;
    }
    case EventType.ReferendaExecuted: {
      return `Referenda #${event.index} executed`;
    }
    case EventType.FellowshipSubmitted: {
      return `Fellowship #${event.index} submitted`;
    }
    case EventType.FellowshipDecisionStarted: {
      return `Fellowship #${event.index} decision started`;
    }
    case EventType.FellowshipConfirmStarted: {
      return `Fellowship #${event.index} confirm started`;
    }
    case EventType.FellowshipConfirmAborted: {
      return `Fellowship #${event.index} confirm aborted`;
    }
    case EventType.FellowshipConfirmed: {
      return `Fellowship #${event.index} confirmed`;
    }
    case EventType.FellowshipCancelled: {
      return `Fellowship #${event.index} canceled`;
    }
    case EventType.FellowshipKilled: {
      return `Fellowship #${event.index} killed`;
    }
    case EventType.FellowshipTimedout: {
      return `Fellowship #${event.index} timed out`;
    }
    case EventType.FellowshipRejected: {
      return `Fellowship #${event.index} rejected`;
    }
    case EventType.FellowshipExecuted: {
      return `Fellowship #${event.index} executed`;
    }
  }
}

function getTitle(event) {
  const timeText = dayjs(event?.indexer?.blockTime).format("hh:mm");
  const title = getEventTitle(event);
  const postUrls = getPostUrlsByEvent(event);
  const postUrl = postUrls[event.type];

  return (
    <span>
      <Tooltip content={"#" + event?.indexer?.blockHeight?.toLocaleString()}>
        <TitleTime>[{timeText}]</TitleTime>
      </Tooltip>{" "}
      <Link href={postUrl} passHref>
        <TitleLink>{title}</TitleLink>
      </Link>
    </span>
  );
}

export default function Title({ event, isFolded, setIsFolded = noop }) {
  return (
    <Wrapper>
      <Left>{getTitle(event)}</Left>
      <Right>
        <div>
          <EventTag event={event} />
        </div>
        <div>
          <FoldButton
            onClick={() => setIsFolded(!isFolded)}
            isFolded={isFolded}
          />
        </div>
      </Right>
    </Wrapper>
  );
}
