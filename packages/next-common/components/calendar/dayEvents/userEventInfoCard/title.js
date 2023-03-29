import React from "react";
import noop from "lodash.noop";
import dayjs from "dayjs";
import styled from "styled-components";
import EventTag from "../eventInfoCard/eventTag";
import FoldButton from "../eventInfoCard/foldButton";
import { flex, gap_x } from "../../../../styles/tailwindcss";

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

function getTitle(event) {
  const timeText = dayjs(event?.timestamp).format("HH:mm");

  return (
    <span>
      [{timeText}] {event.title}
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
