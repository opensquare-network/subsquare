import styled from "styled-components";
import TooltipOrigin from "next-common/components/tooltip";
import FlexBetween from "next-common/components/styled/flexBetween";
import { p_12_medium } from "next-common/styles/componentCss";

export const ProgressGroup = styled.div`
  padding-bottom: 4px;
`;

export const ProgressBarWrapper = styled.div`
  margin: 8px 0;
`;

export const Tooltip = styled(TooltipOrigin)`
  display: block;
`;

export const ProgressInfo = styled(FlexBetween)`
  color: ${(p) => p.theme.textPrimary};
  padding: 4px 0;
  padding-bottom: 8px;
  ${p_12_medium};
`;
export const ProgressTooltipFailContent = styled.span`
  display: inline-flex;
  gap: 8px;
`;
