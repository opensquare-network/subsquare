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
  @media screen and (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const Left = styled.div`
  width: 246px;
  flex: 0 0 246px;
  margin-right: 32px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
  .footer{
    position: absolute;
    bottom: 0;
  }
`;


export default function Content({ left, children }) {
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          {left && <Left>
            {left}
            <Footer/>
          </Left>}
          <Main>{children}</Main>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
