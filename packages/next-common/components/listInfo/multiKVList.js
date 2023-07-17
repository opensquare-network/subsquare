import React, { memo } from "react";
import styled from "styled-components";
import Row from "./row";

const Section = styled.div`
  :not(:first-child) {
    margin-top: 16px;
  }
`;

function MultiKVList({ data = [] }) {
  if (!data || data?.length === 0) {
    return null;
  }

  return (
    <>
      {data.map((item, index) => (
        <Section key={index}>
          {item.map((row, index) => (
            <Row row={row} key={index} />
          ))}
        </Section>
      ))}
    </>
  );
}

export default memo(MultiKVList);
