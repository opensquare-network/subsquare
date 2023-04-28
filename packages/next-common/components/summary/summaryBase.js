import React from "react";
import styled from "styled-components";
import { SummaryCard, SummaryDescription } from "./styled";
import Divider from "../styled/layout/divider";
import SummaryItems from "./summaryItems";

const Wrapper = styled(SummaryCard)`
  margin: 16px 0px;
`;

export default function Summary({ description, items = [], footer }) {
  return (
    <Wrapper>
      <SummaryDescription>{description}</SummaryDescription>
      <Divider margin={16} />
      <SummaryItems items={items} />
      {footer && (
        <>
          <Divider margin={16} />
          {footer}
        </>
      )}
    </Wrapper>
  );
}
