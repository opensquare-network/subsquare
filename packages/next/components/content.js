import styled from "styled-components";
import { no_scroll_bar } from "../styles/componentCss";
import Container from "./container";
import Main from "./main";
import Footer from "./footer";

const Wrapper = styled.div`
  width: 100%;
  flex-grow: 1;
  padding-left: 32px;
  padding-right: 32px;
  @media screen and (max-width: 768px) {
    padding-left: 16px;
    padding-right: 16px;
    padding: 0;
  }
  margin-top: 24px;
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
  left: max(calc((100vw - 1080px) / 2), 32px);
  padding-bottom: 32px;
  height: calc(100vh - 90px);
  overflow-y: scroll;
  ${no_scroll_bar};
  width: 200px;
  flex: 0 0 200px;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

const LeftPlaceHolder = styled.div`
  width: 232px;
  flex: 0 0 232px;
  @media screen and (max-width: 1024px) {
    display: none;
  }
`;

export default function Content({ left, children }) {
  return (
    <Wrapper>
      <Container>
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
      </Container>
    </Wrapper>
  );
}
