import React, { useMemo } from "react";
import noop from "lodash.noop";
import dayjs from "dayjs";
import styled from "styled-components";
import EventTag from "../eventInfoCard/eventTag";
import FoldButton from "../eventInfoCard/foldButton";
import { flex, gap_x, hover, underline } from "../../../../styles/tailwindcss";
import TooltipOrigin from "../../../tooltip";
import { formatNumber, isString } from "@polkadot/util";

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

const Tooltip = styled(TooltipOrigin)``;

function getTitle(event, title) {
  const timeText = dayjs(event?.indexer?.blockTime).format("hh:mm");

  return (
    <span>
      <Tooltip content={"#" + event?.indexer?.blockHeight?.toLocaleString()}>
        <TitleTime>[{timeText}]</TitleTime>
      </Tooltip>{" "}
      <span>{title}</span>
    </span>
  );
}

export default function Title({ event, isFolded, setIsFolded = noop }) {
  const info = event.info;
  const type = event.type;

  const description = useMemo(() => {
    const id = info && (isString(info) ? info : formatNumber(info));
    let s = "";

    switch (type) {
      case "councilElection":
        s = "Election of new council candidates";
        break;

      case "councilMotion":
        s = `Voting ends on council motion ${id}`;
        break;

      case "democracyDispatch":
        s = `Enactment of the result of referendum ${id}`;
        break;

      case "democracyLaunch":
        s = "Start of the next referendum voting period";
        break;

      case "parachainAuction":
        s = `End of the current parachain auction ${id}`;
        break;

      case "parachainLease":
        s = `Start of the next parachain lease period ${id}`;
        break;

      case "referendumDispatch":
        s = `Potential dispatch of referendum ${id} (if passed)`;
        break;

      case "referendumVote":
        s = `Voting ends for referendum ${id}`;
        break;

      case "scheduler":
        s = id
          ? `Execute named scheduled task ${id}`
          : "Execute anonymous scheduled task";
        break;

      case "stakingEpoch":
        s = `Start of a new staking session ${id}`;
        break;

      case "stakingEra":
        s = `Start of a new staking era ${id}`;
        break;

      case "stakingSlash":
        s = `Application of slashes from era ${id}`;
        break;

      case "treasurySpend":
        s = "Start of next spending period";
        break;

      case "societyChallenge":
        s = "Start of next membership challenge period";
        break;

      case "societyRotate":
        s = "Acceptance of new members and bids";
        break;

      default:
        return "";
    }

    return s;
  }, [info, type]);

  return (
    <Wrapper>
      <Left>{getTitle(event, description)}</Left>
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
