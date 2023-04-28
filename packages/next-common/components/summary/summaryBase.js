import React from "react";
import styled, { css } from "styled-components";
import { smcss } from "../../utils/responsive";
import { SummaryCard, SummaryDescription } from "./styled";
import Divider from "../styled/layout/divider";

export const SummaryItems = styled.div`
  display: flex;
  ${smcss(css`
    flex-direction: column;
    gap: 16px;
  `)}
`;

export const SummaryItem = styled.div`
  flex: 1;
`;

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
