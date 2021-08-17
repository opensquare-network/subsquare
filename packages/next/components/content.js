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
  flex: 0 0 246px;
  margin-right: 32px;
  @media screen and (max-width: 1000px) {
    display: none;
  }
`;

const Right = styled.div`
  width: 246px;
  flex: 0 0 auto;
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

export default function Content({ left, right, children }) {
  return (
    <Wrapper>
      <Container>
        <ContentWrapper>
          <Left>{left}</Left>
          <Main>{children}</Main>
          {right && <Right>{right}</Right>}
        </ContentWrapper>
      </Container>
    </Wrapper>
  );
}
