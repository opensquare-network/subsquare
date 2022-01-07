import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 12px;
  color: #f44336;
  margin-top: 8px;
`;

export default function ErrorText({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
