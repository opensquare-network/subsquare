import styled from "styled-components";

import Header from "./header";
import Content from "./content";
import Toast from "components/toast";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function Layout({ user, left, children }) {
  return (
    <Wrapper>
      <Header user={user} left={left} />
      <Content left={left}>
        {children}
      </Content>
      <Toast />
    </Wrapper>
  );
}
