import React, { memo } from "react";
import styled from "styled-components";
import Accordion from "./accordion";
import Row from "./row";

const Section = styled.div`
  :not(:first-child) {
    margin-top: 16px;
  }
`;

function MultiKVList({ data, title, showFold = true }) {
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <Accordion title={title} showFold={showFold}>
      {data.map((item, index) => (
        <Section key={index}>
          {item.map((row, index) => (
            <Row row={row} key={index} />
          ))}
        </Section>
      ))}
    </Accordion>
  );
}

export default memo(MultiKVList);
