import styled from "styled-components";

const Wrapper = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 500;
  font-size: 14px;
  line-height: 20px;

  color: #1e2134;
`;

export default function Title({ text }) {
  return <Wrapper>{text}</Wrapper>;
}
