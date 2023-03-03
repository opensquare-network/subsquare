import React from "react";
import noop from "lodash.noop";
import dayjs from "dayjs";
import styled from "styled-components";
import EventTag from "./eventTag";
import FoldButton from "./foldButton";
import { stringUpperFirst } from "@polkadot/util";

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  color: ${(p) => p.theme.textPrimary};
`;

const Left = styled.div`
  flex: 1;
`;
const Right = styled.div`
  display: flex;
  justify-content: right;
  gap: 8px;
`;

function getTitle(event) {
  const timeText = dayjs(event?.indexer?.blockTime).format("hh:mm");
  const status = event?.type?.split("_").pop();
  return `[${timeText}] [${stringUpperFirst(status)}] ${
    event.data?.postTitle || "Untitled"
  }`;
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
