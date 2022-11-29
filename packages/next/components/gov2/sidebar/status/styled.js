import styled from "styled-components";
import TooltipOrigin from "next-common/components/tooltip";
import FlexBetween from "next-common/components/styled/flexBetween";
import { p_14_normal } from "next-common/styles/componentCss";

export const ProgressGroup = styled.div``;

export const Tooltip = styled(TooltipOrigin)`
  display: block;
`;

export const ProgressInfo = styled(FlexBetween)`
  color: ${(p) => p.theme.textPrimary};
  ${p_14_normal};
`;
export const ProgressInfoLabel = styled.p`
  font-weight: 500;
`;
