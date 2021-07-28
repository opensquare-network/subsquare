import styled from "styled-components";

import Header from "./header";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

export default function Layout() {
  return (
    <Wrapper>
      <Header />
    </Wrapper>
  );
}
