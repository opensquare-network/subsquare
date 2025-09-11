import styled from "styled-components";
import tw from "tailwind-styled-components";

const Common = tw.span`
  inline-flex items-center
  py-0.5 px-2
  text12Medium text-textPrimaryContrast
  rounded
  capitalize
`;

export const CommonTag = Common;

export const StartTag = styled(Common)`
  background: var(--azure500);
`;

export const MotionTag = styled(Common)`
  background: var(--purple500);
`;

export const ActiveTag = styled(Common)`
  background: var(--blue500);
`;

export const PositiveTag = styled(Common)`
  background: var(--green500);
`;

export const NegativeTag = styled(Common)`
  background: var(--red500);
`;

export const ClosedTag = styled(Common)`
  background: var(--neutral500);
`;

export const ThemedTag = tw(Common)`
bg-theme100
!text-theme500
`;

export const BaseTag = Common;
