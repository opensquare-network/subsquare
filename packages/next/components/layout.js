import styled from "styled-components";

import Header from "./header";
import Content from "./content";
import Toast from "components/toast";
import Footer from "./footer";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function Layout({ user, left, right, children }) {
  return (
    <Wrapper>
      <Header user={user} left={left} />
      <Content left={left} right={right}>
        {children}
      </Content>
      <Footer />
      <Toast />
    </Wrapper>
  );
}
