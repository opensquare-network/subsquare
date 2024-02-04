import React from "react";
import styled, { css } from "styled-components";
import Flex from "next-common/components/styled/flex";
import { HoverSecondaryCard } from "next-common/components/styled/containers/secondaryCard";
import Divider from "next-common/components/styled/layout/divider";
import { smcss } from "next-common/utils/responsive";

const Wrapper = styled(HoverSecondaryCard)`
  display: flex;
  align-items: flex-start;
`;

const FooterWrapper = styled(Flex)`
  justify-content: space-between;
  flex-wrap: nowrap;
`;

const HeadWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 8px;

  ${smcss(css`
    display: block;
  `)};
`;

const ContentWrapper = styled.div`
  flex: 1;
`;

export default function PostListItemLayout({
  title,
  titleExtra,
  footer,
  banner,
}) {
  return (
    <Wrapper>
      <ContentWrapper>
        <HeadWrapper>
          {title}
          {titleExtra}
        </HeadWrapper>
        <Divider margin={12} />
        <FooterWrapper>{footer}</FooterWrapper>
      </ContentWrapper>
      {banner}
    </Wrapper>
  );
}
