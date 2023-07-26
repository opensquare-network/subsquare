import React from "react";
import styled, { css } from "styled-components";
import { no_scroll_bar } from "next-common/styles/componentCss";
import Main from "next-common/components/main";
import Footer from "next-common/components/layout/footer";
import { pageMaxWidth } from "../../utils/constants";
import { mdcss } from "../../utils/responsive";
import OutWrapper from "../styled/outWrapper";

const leftWidth = 236;
const gap = 32;

const Wrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding: 0;
  }
  margin-top: 26px;
  margin-bottom: 32px;
`;

const ContentWrapper = styled.div`
  max-width: 100%;
  display: flex;
  flex-grow: 1;
  position: relative;
  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Left = styled.div`
  position: fixed;
  padding-bottom: 32px;
  height: calc(100vh - 90px);
  overflow-y: scroll;
  ${no_scroll_bar};
  width: ${leftWidth}px;
  flex: 0 0 ${leftWidth}px;
  overscroll-behavior: none;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const MobileFooterWrapper = styled.div`
  display: none;
  @media screen and (max-width: 1024px) {
    display: flex;
  }
  justify-content: center;
  padding-top: 16px;
  margin-bottom: -16px;
  footer > svg {
    display: none;
  }
  footer > div:last-child {
    justify-content: center;
  }
  text-align: center;
`;

const MainWrapper = styled.div`
  flex-grow: 1;
  margin: 0 auto;
  max-width: 100%;

  ${(p) =>
    p.hasLeft &&
    css`
      padding-left: ${leftWidth + gap}px;
      max-width: ${pageMaxWidth}px;

      ${mdcss(css`
        padding-left: 0;
      `)}
    `};

  ${mdcss(css`
    margin: unset;
  `)}
`;

export default function Content({ left, children }) {
  return (
    <Wrapper>
      <OutWrapper>
        <ContentWrapper>
          {left && (
            <Left>
              {left}
              <Footer />
            </Left>
          )}

          <MainWrapper hasLeft={!!left}>
            <Main>{children}</Main>
          </MainWrapper>
        </ContentWrapper>
      </OutWrapper>

      <MobileFooterWrapper>
        <Footer />
      </MobileFooterWrapper>
    </Wrapper>
  );
}
