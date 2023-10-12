import styled, { css } from "styled-components";
import { GreyPanel } from "../../../styled/containers/greyPanel";
import tw from "tailwind-styled-components";

export const ThresholdInfo = styled(GreyPanel)`
  display: block;
  padding: 10px 16px;
  color: var(--red500);
  background-color: var(--red100);

  ${(p) =>
    p.positive &&
    css`
      background-color: var(--green100);
      color: var(--green500);
    `}
`;

export const ThresholdInfoLabel = tw.span`
  text14Medium
  `;
export const ThresholdInfoValue = tw.span`
  text14Medium
`;
