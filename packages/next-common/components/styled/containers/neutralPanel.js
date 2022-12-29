import styled from "styled-components";

export const NeutralPanel = styled.div`
  background: ${(p) => p.theme.neutral};
  border: 1px solid ${(p) => p.theme.grey200Border};
  box-shadow: ${(p) => p.theme.shadow200};
  border-radius: 6px;
`;
