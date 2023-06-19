import styled from "styled-components";
import { NeutralPanel } from "./neutralPanel";

export const SecondaryCard = styled(NeutralPanel)`
  box-shadow: var(--shadow100);
  border-radius: 8px;
  padding: 24px;
`;

export const HoverSecondaryCard = styled(SecondaryCard)`
  :hover {
    box-shadow: var(--shadow200);
  }
`;

// Used for cards on detail page
export const SecondaryCardDetail = styled(SecondaryCard)`
  @media screen and (max-width: 768px) {
    border-radius: 0;
  }
`;
