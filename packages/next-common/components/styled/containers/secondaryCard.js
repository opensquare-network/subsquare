import styled from "styled-components";
import { NeutralPanel } from "./neutralPanel";

export const SecondaryCard = styled(NeutralPanel)`
  box-shadow: var(--shadow100);
  border-radius: 12px;
  padding: 24px;
`;

export const HoverSecondaryCard = styled(SecondaryCard)`
  :hover {
    box-shadow: var(--shadow200);
  }
`;

// Used for cards on detail page
export const SecondaryCardDetail = styled(SecondaryCard)``;
