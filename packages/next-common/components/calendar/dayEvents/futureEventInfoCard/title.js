import React, { useMemo } from "react";
import { noop } from "lodash-es";
import dayjs from "dayjs";
import styled from "styled-components";
import { formatNumber, isString } from "@polkadot/util";
import EventTag from "../eventInfoCard/eventTag";
import FoldButton from "../eventInfoCard/foldButton";
import TooltipOrigin from "../../../tooltip";
import { FutureEventType } from "./futureEventType";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;
  gap: 8px;

  color: var(--textPrimary);

  @media screen and (max-width: 768px) {
    flex-direction: column;
  }
`;

const Tooltip = styled(TooltipOrigin)``;

function getTitle(event, title) {
  const timeText = dayjs(event?.indexer?.blockTime).format("HH:mm");

  return (
    <span>
      <Tooltip content={"#" + event?.indexer?.blockHeight?.toLocaleString()}>
        <div className="hover:underline">[{timeText}]</div>
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
      case FutureEventType.councilElection: {
        s = "Election of new council candidates";
        break;
      }
      case FutureEventType.councilMotion: {
        s = `Voting ends on council motion ${id}`;
        break;
      }
      case FutureEventType.democracyDispatch: {
        s = `Enactment of the result of referendum ${id}`;
        break;
      }
      case FutureEventType.democracyLaunch: {
        s = "Start of the next referendum voting period";
        break;
      }
      case FutureEventType.parachainAuction: {
        s = `End of the current parachain auction ${id}`;
        break;
      }
      case FutureEventType.parachainLease: {
        s = `Start of the next parachain lease period ${id}`;
        break;
      }
      case FutureEventType.referendumDispatch: {
        s = `Potential dispatch of referendum ${id} (if passed)`;
        break;
      }
      case FutureEventType.referendumVote: {
        s = `Voting ends for referendum ${id}`;
        break;
      }
      case FutureEventType.scheduler: {
        s = id
          ? `Execute named scheduled task ${id}`
          : "Execute anonymous scheduled task";
        break;
      }
      case FutureEventType.stakingEpoch: {
        s = `Start of a new staking session ${id}`;
        break;
      }
      case FutureEventType.stakingEra: {
        s = `Start of a new staking era ${id}`;
        break;
      }
      case FutureEventType.stakingSlash: {
        s = `Application of slashes from era ${id}`;
        break;
      }
      case FutureEventType.treasurySpend: {
        s = "Start of next spending period";
        break;
      }
      case FutureEventType.societyChallenge: {
        s = "Start of next membership challenge period";
        break;
      }
      case FutureEventType.societyRotate: {
        s = "Acceptance of new members and bids";
        break;
      }
      default: {
        return "";
      }
    }

    return s;
  }, [info, type]);

  return (
    <Wrapper>
      <div className="flex-1 flex gap-x-1" style={{ wordBreak: "break-word" }}>
        {getTitle(event, description)}
      </div>
      <div className="flex justify-between gap-2">
        <div>
          <EventTag event={event} />
        </div>
        <div>
          <FoldButton
            onClick={() => setIsFolded(!isFolded)}
            isFolded={isFolded}
          />
        </div>
      </div>
    </Wrapper>
  );
}
