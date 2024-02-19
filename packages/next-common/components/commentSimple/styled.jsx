const { default: styled } = require("styled-components");
const { default: Flex } = require("../styled/flex");
const { HoverSecondaryCard } = require("../styled/containers/secondaryCard");

export const Wrapper = styled(HoverSecondaryCard)`
  display: flex;
  align-items: flex-start;
`;

export const DividerWrapper = styled(Flex)`
  flex-wrap: nowrap;
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
  > div:first-child {
    color: var(--textSecondary);
  }
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

export const MaxWidthInfo = styled(Info)`
  a {
    display: block;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;

export const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

export const ContentWrapper = styled.div`
  overflow: hidden;
  color: var(--textPrimary);
  div.markdown-body,
  div.html-body {
    color: var(--textPrimary);
  }
`;

export const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;

  .symbol {
    color: var(--textTertiary);
  }

  @media screen and (max-width: 768px) {
    flex-wrap: wrap;
    > span {
      line-height: 21px;
      flex-basis: 100%;
    }
  }
`;
