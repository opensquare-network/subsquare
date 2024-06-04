import styled, { css } from "styled-components";
import tw from "tailwind-styled-components";

export const OptionsWrapper = tw.div`
  z-[999999]
  absolute
  -left-px
  right-0
  top-[calc(100%+4px)]
  bg-neutral100
  shadow-200
  rounded
  py-2
  px-0
  w-[calc(100%+2px)]
  text-textPrimary
  dark:border
  dark:border-neutral300
`;

export const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  height: ${(p) => p.height}px;
  font-size: 14px;
  font-weight: 400;
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
