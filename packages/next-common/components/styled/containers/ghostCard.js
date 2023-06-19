import styled from "styled-components";

export const GhostCard = styled.div`
  background: var(--neutral300);
  border-radius: 8px;
  padding: 24px;

  @media screen and (max-width: 768px) {
    border-radius: 0;
  }
`;
