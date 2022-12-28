import styled from "styled-components";

export const NeutralPanel = styled.div`
  background-color: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey200Border};
  box-shadow: ${(p) => p.theme.shadow200};
  color: ${(p) => p.theme.textPrimary};
  border-radius: 6px;
`;
