import React from "react";
import noop from "lodash.noop";
import dayjs from "dayjs";
import styled from "styled-components";
import EventTag from "./eventTag";
import FoldButton from "./foldButton";
import { stringUpperFirst } from "@polkadot/util";
import {
  flex,
  gap_x,
  hover,
  no_underline,
  underline,
} from "../../../../styles/tailwindcss";
import Link from "next/link";
import TooltipOrigin from "../../../tooltip";
import { getPostUrlsByEvent } from "./utils";

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
const TitleStatus = styled.span`
  ${no_underline}
`;

const Tooltip = styled(TooltipOrigin)``;

function getTitle(event) {
  const timeText = dayjs(event?.indexer?.blockTime).format("hh:mm");
  const status = event?.type?.split("_").pop();
  const postUrls = getPostUrlsByEvent(event);
  const postUrl = postUrls[event.type];

  return (
    <span>
      <Tooltip content={"#" + event?.indexer?.blockHeight?.toLocaleString()}>
        <TitleTime>[{timeText}]</TitleTime>
      </Tooltip>{" "}
      <TitleStatus>[{stringUpperFirst(status)}]</TitleStatus>{" "}
      <Link href={postUrl} passHref>
        <TitleLink>{event.data?.postTitle || "untitled"}</TitleLink>
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
