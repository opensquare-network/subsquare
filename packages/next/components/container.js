import styled from "styled-components";

const Wrapper = styled.div`
  padding: 0 60px;
  @media screen and (max-width: 900px) {
    padding: 0 32px;
  }
  @media screen and (max-width: 600px) {
    padding: 0 16px;
  }
`;

export default function Container({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
