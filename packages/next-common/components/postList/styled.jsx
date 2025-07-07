import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";
import { HoverSecondaryCard } from "../styled/containers/secondaryCard";
import { smcss } from "../../utils/responsive";
import tw from "tailwind-styled-components";

export const ListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;

  > :not(:first-child) {
    margin-top: 16px;
  }
`;

export const Wrapper = styled(HoverSecondaryCard)`
  display: flex;
  align-items: flex-start;
`;

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
  @media screen and (max-width: 768px) {
    > :nth-child(3) {
      display: none;
    }
  }

  @media screen and (max-width: 375px) {
    > :nth-child(2) {
      display: none;
    }
  }
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

export const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
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

export const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  ${smcss(css`
    display: block;
  `)};
`;

export const ContentWrapper = styled.div`
  flex: 1;
`;

export const BannerWrapper = styled.div`
  margin-top: 0 !important;
  margin-left: 16px;
  width: 120px;
  height: 67px;
  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
    object-fit: cover;
  }
`;
