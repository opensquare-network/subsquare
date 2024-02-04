import Flex from "../styled/flex";
import styled from "styled-components";
import tw from "tailwind-styled-components";

export const DividerWrapper = styled(Flex)`
  flex-wrap: wrap;
  min-height: 20px;

  > span {
    display: inline-block;
    height: 12px;
  }

  > :not(:first-child) {
    ::before {
      content: "·";
      font-size: 12px;
      color: var(--textTertiary);
      margin: 0 8px;
    }
  }
`;

export const Footer = styled(DividerWrapper)`
  /* @media screen and (max-width: 768px) {
    > :nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 375px) {
    > :nth-child(2) {
      display: none;
    }
  } */
`;

export const Info = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: var(--textSecondary);
  svg {
    margin-right: 4px;
    path {
      stroke: var(--textTertiary);
    }
  }
  .elapseIcon > * {
    margin-left: 8px;
  }
`;

export const MobileHiddenInfo = styled(Info)`
  @media screen and (max-width: 768px) {
    display: none;
  }
`;

export const TitleExtraValue = styled(Flex)`
  color: var(--textPrimary);
`;

export const TitleExtra = tw.div`
  text14Medium
  flex items-start
  py-0.5 ml-2
  text-textTertiary
  max-sm:mt-2 max-sm:ml-0
`;
