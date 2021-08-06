import styled from "styled-components";

import Header from "./header";
import Content from "./content";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function Layout({ left, right, children }) {
  return (
    <Wrapper>
      <Header left={left} />
      <Content left={left} right={right}>
        {children}
      </Content>
    </Wrapper>
  );
}
