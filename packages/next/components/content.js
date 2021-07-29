import styled from "styled-components";

import Container from "./container";
import Menu from "./menu";
import Main from "./main";
import Footer from "./footer";
import Trends from "./trends";

const Wrapper = styled.div`
  flex-grow: 1;
  margin: 26px 0;
`;

const ContentWrapper = styled.div`
  display: flex;
  @media screen and (max-width: 600px) {
    flex-direction: column-reverse;
  }
`;

const Left = styled.div`
  width: 246px;
  margin-right: 32px;
  @media screen and (max-width: 900px) {
    display: none;
  }
`;

const Right = styled.div`
  width: 246px;
  margin-left: 32px;
  > :not(:first-child) {
    margin-top: 16px;
  }
  @media screen and (max-width: 600px) {
    margin-left: 0;
    width: auto;
    margin-bottom: 16px;
  }
`;

export default function Content() {
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <Left>
            <Menu />
          </Left>
          <Main />
          <Right>
            <Trends />
            <Footer />
          </Right>
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
