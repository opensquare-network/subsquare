import React from "react";
import styled from "styled-components";
import { no_scroll_bar } from "next-common/styles/componentCss";
import Main from "next-common/components/main";
import Footer from "next-common/components/layout/footer";
import { pageHomeMainContentWidth, pageMaxWidth } from "../../utils/constants";

const leftWidth = 236;
const gap = 32;
const leftPlaceHolderWidth = pageMaxWidth - gap - pageHomeMainContentWidth;
const offsetLeftCss = `max(calc((100vw - ${pageMaxWidth}px) / 2), 32px)`;

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
  display: flex;
  position: relative;
  @media screen and (max-width: 768px) {
    flex-direction: column-reverse;
  }
`;

const Left = styled.div`
  position: fixed;
  left: ${offsetLeftCss};
  padding-bottom: 32px;
  height: calc(100vh - 90px);
  overflow-y: scroll;
  ${no_scroll_bar};
  width: ${leftWidth}px;
  flex: 0 0 ${leftWidth}px;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const LeftPlaceHolder = styled.div`
  width: calc(${offsetLeftCss} + ${leftPlaceHolderWidth}px);
  flex: 0 0 calc(${offsetLeftCss} + ${leftPlaceHolderWidth}px);
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

export default function Content({ left, children }) {
  return (
    <Wrapper>
      <div>
        <ContentWrapper>
          {left && (
            <Left>
              {left}
              <Footer />
            </Left>
          )}
          {left && <LeftPlaceHolder />}
          <Main>{children}</Main>
        </ContentWrapper>
      </div>
      <MobileFooterWrapper>
        <Footer />
      </MobileFooterWrapper>
    </Wrapper>
  );
}
