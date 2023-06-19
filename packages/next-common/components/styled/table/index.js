import React from "react";
import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  background: var(--neutral100);
  border: 1px solid var(--neutral300);
  color: var(--textPrimary);
  box-sizing: border-box;
  box-shadow: var(--shadow100);
  border-radius: 6px;
  padding: 24px;

  @media screen and (max-width: 392px) {
    .autohide {
      display: none;
    }
    th.clickable {
      color: var(--textSecondary);
      cursor: pointer;
      pointer-events: auto;
    }
  }
`;

export const StyledTr = styled.tr``;

export const StyledTh = styled.th`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 100%;
  letter-spacing: 0.16em;
  color: var(--textTertiary);
  pointer-events: none;
`;

export const StyledTd = styled.td`
  padding: 10px 0 10px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: var(--textPrimary);
`;

export const EmptyTd = styled.td`
  padding: 10px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: var(--textTertiary);
`;

export const RowSplitter = ({ backgroundColor, padding }) => (
  <tr>
    <td colSpan="3" style={{ padding }}>
      <div style={{ height: "1px", backgroundColor }} />
    </td>
  </tr>
);
