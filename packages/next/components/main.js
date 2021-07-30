import styled from "styled-components";

const Wrapper = styled.div`
  flex-grow: 1;
`;

export default function Main({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
