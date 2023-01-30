import styled from "styled-components";
import { p_14_normal } from "../../styles/componentCss";
import { PrimaryCard } from "./containers/primaryCard";

export const Wrapper = styled(PrimaryCard)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  svg {
    path {
      fill: ${(props) => props.theme.textPlaceholder};
    }
  }
`;

export const H2 = styled.h2`
  margin: 16px;
  color: ${(props) => props.theme.textPrimary};
`;

export const P = styled.p`
  ${p_14_normal}
  max-width: 343px;
  margin: 0;
  text-align: center;
  padding: 0;
  color: ${(props) => props.theme.textSecondary};
`;
