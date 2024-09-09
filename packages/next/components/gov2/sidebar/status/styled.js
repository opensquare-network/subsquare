import styled from "styled-components";
import TooltipOrigin from "next-common/components/tooltip";
import FlexBetween from "next-common/components/styled/flexBetween";
import tw from "tailwind-styled-components";

export const ProgressGroup = styled.div`
  position: relative;
  padding-bottom: 4px;
`;

export const ProgressBarWrapper = styled.div`
  margin: 8px 0;
`;

export const Tooltip = styled(TooltipOrigin)`
  display: block;
`;

export const ProgressInfo = tw(FlexBetween)`
  text-textPrimary text12Medium
  py-1 pb-2
`;
export const ProgressTooltipFailContent = styled.span`
  display: inline-flex;
  gap: 8px;
`;
