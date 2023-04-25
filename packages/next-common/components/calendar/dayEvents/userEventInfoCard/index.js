import React from "react";
import styled from "styled-components";
import Divider from "../../../styled/layout/divider";
import Title from "./title";
import { useState } from "react";
import TitleItem from "../eventInfoCard/infoItem/titleItem";
import ProposerItem from "../eventInfoCard/infoItem/proposerItem";
import DescriptionItem from "../eventInfoCard/infoItem/descriptionItem";
import LinkItem from "./infoItem/linkItem";
import EndDateItem from "./infoItem/endDateItem";

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

export default function UserEventInfoCard({ event, refresh }) {
  const [isFolded, setIsFolded] = useState(false);

  if (!event) {
    return null;
  }

  return (
    <Wrapper>
      <Title event={event} isFolded={isFolded} setIsFolded={setIsFolded} refresh={refresh} />
      {!isFolded && (
        <>
          <Divider style={{ width: "100%" }} />
          <Content>
            <TitleItem title={event.title} />
            <ProposerItem proposer={event.proposer} />
            {event.description && (
              <DescriptionItem description={event.description} />
            )}
            {event.link && <LinkItem link={event.link} />}
            {event.endTimestamp && <EndDateItem timestamp={event.endTimestamp} />}
          </Content>
        </>
      )}
    </Wrapper>
  );
}
