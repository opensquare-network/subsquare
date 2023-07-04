import React from "react";
import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import Title from "./title";
import { useState } from "react";
import BlockHeightItem from "./infoItem/blockHeight";
import CouncilMotionContent from "./councilMotionContent";
import DemocracyReferendumContent from "./democracyReferendumContent";
import { FutureEventType } from "./futureEventType";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  gap: 8px;

  background: var(--neutral100);
  border: 1px solid var(--neutral300);

  box-shadow: var(--shadow100);
  border-radius: 4px;
`;

const Content = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: var(--textPrimary);
`;

export default function FutureEventInfoCard({ event }) {
  const [isFolded, setIsFolded] = useState(false);

  if (!event) {
    return null;
  }

  let content = <BlockHeightItem blockHeight={event?.indexer?.blockHeight} />;

  if ([FutureEventType.councilMotion].includes(event?.type)) {
    content = <CouncilMotionContent event={event} />;
  } else if (
    [
      FutureEventType.referendumDispatch,
      FutureEventType.referendumVote,
    ].includes(event?.type)
  ) {
    content = <DemocracyReferendumContent event={event} />;
  }

  return (
    <Wrapper>
      <Title event={event} isFolded={isFolded} setIsFolded={setIsFolded} />
      {!isFolded && (
        <>
          <Divider style={{ width: "100%" }} />
          <Content>{content}</Content>
        </>
      )}
    </Wrapper>
  );
}
