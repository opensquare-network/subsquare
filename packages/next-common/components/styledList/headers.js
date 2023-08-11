import React from "react";
import RowSplitter from "./rowSplitter";
import { StyledTh } from "./styled";
import styled from "styled-components";
import { p_12_bold } from "next-common/styles/componentCss";

const ThWrapper = styled.div`
  height: inherit;
  ${p_12_bold}
`;

export function Headers({ columns }) {
  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <StyledTh key={index} style={col.style} className={col.className}>
            <ThWrapper>{col.name}</ThWrapper>
          </StyledTh>
        ))}
      </tr>
      <RowSplitter backgroundColor="var(--neutral300)" />
    </thead>
  );
}
