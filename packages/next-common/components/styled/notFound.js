import styled from "styled-components";
import { p_14_normal } from "../../styles/componentCss";
import { PrimaryCard } from "./containers/primaryCard";

export const Wrapper = styled(PrimaryCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border: 0;
  box-shadow: none;

  svg {
    path {
      fill: var(--textDisabled);
    }
  }
`;

export const H2 = styled.h2`
  margin: 16px;
  color: var(--textPrimary);
`;

export const P = styled.p`
  ${p_14_normal}
  max-width: 343px;
  margin: 0;
  text-align: center;
  padding: 0;
  color: var(--textSecondary);
`;
