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
  @media screen and (max-height: 750px) {
    padding-top: 0;
  }
`;

export default function LayoutFixedHeader({ user, left, children, chain }) {
  return (
    <Wrapper>
      <Header user={user} left={left} chain={chain} fixedTop={true} />
      <Content left={left}>{children}</Content>
      <Toast />
    </Wrapper>
  );
}
