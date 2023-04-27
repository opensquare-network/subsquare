import React, { Fragment } from "react";
import { useThemeSetting } from "next-common/context/theme";
import { StyledTd } from "./styled";
import RowSplitter from "./rowSplitter";
import styled, { css } from "styled-components";

const StyledTr = styled.tr`
  ${({ clickable }) => clickable && css`
    cursor: pointer;
  `}
`;

function DataRow({ row, columns }) {
  return (
    <StyledTr clickable={!!row.onClick} onClick={row.onClick}>
      {row?.map((val, i) => (
        <StyledTd
          key={i}
          style={columns[i].style}
          className={columns[i].className}
        >
          {val}
        </StyledTd>
      ))}
    </StyledTr>
  );
}

export default function DataRows({ rows, columns }) {
  const theme = useThemeSetting();

  return rows.map((row, index) => (
    <Fragment key={index}>
      <DataRow row={row} columns={columns} />
      {index !== rows.length - 1 && (
        <RowSplitter backgroundColor={theme.isDark ? "#272A3A" : "#F6F7FA"} />
      )}
    </Fragment>
  ));
}
