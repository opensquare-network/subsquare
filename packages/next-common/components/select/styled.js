import styled, { css } from "styled-components";
import tw from "tailwind-styled-components";

const CommonOptionWrapper = tw.div`
  z-[999999]
  absolute
  top-[calc(100%+4px)]
  bg-neutral100
  shadow-200
  rounded
  py-2
  px-0
  text-textPrimary
  dark:border
  dark:border-neutral300
`;

export const OptionsWrapper = tw(CommonOptionWrapper)`
  -left-px
  right-0
  w-[calc(100%+2px)]
`;

export const OptionsPadLeftWrapper = tw(CommonOptionWrapper)`
  -left-px
  min-w-[calc(100%+2px)]
  whitespace-nowrap
`;

export const OptionsPadRightWrapper = tw(CommonOptionWrapper)`
  right-0
  min-w-[calc(100%+2px)]
  whitespace-nowrap
`;

export const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  height: ${(p) => p.height}px;
  cursor: pointer;
  color: var(--textPrimary);
  background: var(--neutral100);
  border-color: var(--neutral400);
  :hover {
    background-color: var(--neutral200);
  }

  ${(p) =>
    p.active &&
    css`
      color: var(--textPrimary);
      background-color: var(--neutral200);
    `}
`;
