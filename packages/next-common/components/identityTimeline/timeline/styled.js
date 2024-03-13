import styled from "styled-components";

export const Text = styled.div`
  color: ${(p) => p.theme.textPrimary};
`;

export const BoldText = styled(Text)`
  font-weight: 500;
`;

export const BreakText = styled(Text)`
  word-break: break-all;
`;
