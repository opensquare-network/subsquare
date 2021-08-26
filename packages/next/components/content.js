import styled from "styled-components";

import Container from "./container";
import Main from "./main";
import Footer from "./footer";

const Wrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  max-width: 1080px;
  margin: 26px auto;
`;

const ContentWrapper = styled.div`
  display: flex;
  position: relative;
  padding-left: 232px;
  @media screen and (max-width: 1080px) {
    padding: 0 60px;
  }
  @media screen and (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const Left = styled.div`
  position: fixed;
  left: calc((100vw - 1080px)/2);
  height: calc(100vh - 64px);
  width: 200px;
  flex: 0 0 200px;
  @media screen and (max-width: 1080px) {
    display: none;
  }
  .footer {
    position: absolute;
    bottom: 32px;
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
          <Main>{children}</Main>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
