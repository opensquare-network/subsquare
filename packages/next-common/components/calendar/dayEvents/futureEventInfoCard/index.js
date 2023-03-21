import React from "react";
import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import Title from "./title";
import { useState } from "react";
import BlockHeightItem from "./infoItem/blockHeight";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 12px;
  gap: 8px;

  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey200Border};

  box-shadow: ${(p) => p.theme.shadow100};
  border-radius: 4px;
`;

const Content = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: ${(p) => p.theme.textPrimary};
`;

export default function FutureEventInfoCard({ event }) {
  const [isFolded, setIsFolded] = useState(false);

  if (!event) {
    return null;
  }

  return (
    <Wrapper>
      <Title event={event} isFolded={isFolded} setIsFolded={setIsFolded} />
      {!isFolded && (
        <>
          <Divider style={{ width: "100%" }} />
          <Content>
            <BlockHeightItem blockHeight={event?.indexer?.blockHeight} />
          </Content>
        </>
      )}
    </Wrapper>
  );
}
