import styled from "styled-components";
import { shadow_100 } from "../../../styles/componentCss";
import { NeutralPanel } from "./neutralPanel";

export const PrimaryCard = styled(NeutralPanel)`
  padding: 48px;
  color: var(--textPrimary);
  ${shadow_100};

  @media screen and (max-width: 768px) {
    padding: 24px;
    border-radius: 0;
  }
`;
