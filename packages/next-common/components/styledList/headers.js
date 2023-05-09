import React from "react";
import { useThemeSetting } from "next-common/context/theme";
import RowSplitter from "./rowSplitter";
import { StyledTh } from "./styled";
import styled from "styled-components";
import { p_12_bold } from "next-common/styles/componentCss";

const ThWrapper = styled.div`
  height: inherit;
  ${p_12_bold}
`;

export function Headers({ columns }) {
  const theme = useThemeSetting();

  return (
    <thead>
      <tr>
        {columns.map((col, index) => (
          <StyledTh key={index} style={col.style} className={col.className}>
            <ThWrapper>{col.name}</ThWrapper>
          </StyledTh>
        ))}
      </tr>
      <RowSplitter backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"} />
    </thead>
  );
}
