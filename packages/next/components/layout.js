import styled from "styled-components";

import Header from "./header";
import Content from "./content";
import Toast from "components/toast";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  justify-content: center;
  padding-top: 64px;
`;

export default function Layout({ user, left, children, chain, isWeb3Login }) {
  return (
    <Wrapper>
      <Header user={user} left={left} chain={chain} isWeb3Login={isWeb3Login} />
      <Content left={left}>{children}</Content>
      <Toast />
    </Wrapper>
  );
}
