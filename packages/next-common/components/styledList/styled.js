import styled from "styled-components";
import tw from "tailwind-styled-components";

export const StyledTable = styled.table`
  width: 100%;
  background: var(--neutral100);
  color: var(--textPrimary);
`;

export const StyledTh = tw.th`
  text-textTertiary text14Medium tracking-normal
  pt-2 pb-4
  h-3
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
