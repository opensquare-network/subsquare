import styled, { css } from "styled-components";
import { GreyPanel } from "../../../styled/containers/greyPanel";
import { p_14_medium, p_14_normal } from "../../../../styles/componentCss";

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

export const ThresholdInfoLabel = styled.span`
  ${p_14_medium};
`;
export const ThresholdInfoValue = styled.span`
  ${p_14_normal};
`;
