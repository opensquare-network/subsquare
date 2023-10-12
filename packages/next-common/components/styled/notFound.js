import styled from "styled-components";
import { PrimaryCard } from "./containers/primaryCard";
import tw from "tailwind-styled-components";

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

export const P = tw.p`
  text14Medium
  max-w-[343px]
  m-0 p-0
  text-center text-textSecondary
`;
