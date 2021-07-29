import styled from "styled-components";

import Overview from "./overview";

const Wrapper = styled.div`
  flex-grow: 1;
`;

export default function Main() {
  return (
    <Wrapper>
      <Overview />
    </Wrapper>
  );
}
