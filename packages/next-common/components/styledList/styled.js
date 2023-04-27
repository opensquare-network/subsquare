import styled from "styled-components";

export const StyledTable = styled.table`
  width: 100%;
  background: ${(props) => props.theme.neutral};
  color: ${(props) => props.theme.textPrimary};
`;

export const StyledTh = styled.th`
  font-style: normal;
  font-weight: bold;
  font-size: 12px;
  line-height: 11px;
  letter-spacing: 0.16em;
  color: ${(props) => props.theme.textTertiary};
`;

export const StyledTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 100%;
  color: ${(props) => props.theme.textPrimary};
`;

export const EmptyTd = styled.td`
  padding: 12px 0 12px 0;
  font-style: normal;
  font-weight: normal;
  font-size: 14px;
  line-height: 140%;
  text-align: center;
  color: ${(props) => props.theme.textTertiary};
`;
