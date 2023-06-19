import { p_12_bold } from "next-common/styles/componentCss";
import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  background: var(--neutral100);
  color: var(--textPrimary);
`;

export const StyledTh = styled.th`
  ${p_12_bold};
  letter-spacing: 0.16em;
  color: var(--textTertiary);
  padding-top: 8px;
  padding-bottom: 16px;
  height: 12px;
`;

export const StyledTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: var(--textPrimary);
`;

export const EmptyTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: var(--textTertiary);
`;
