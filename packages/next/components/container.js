import styled from "styled-components";

const Wrapper = styled.div`
  padding: 0 60px;
  max-width: 1140px;
  margin: 0 auto;
  @media screen and (max-width: 1000px) {
    padding: 0 32px;
  }
  @media screen and (max-width: 600px) {
    padding: 0 16px;
  }
`;

export default function Container({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
