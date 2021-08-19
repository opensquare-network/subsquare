import styled from "styled-components";

const Wrapper = styled.div`
  padding: 16px 48px;
  text-align: center;
  font-size: 14px;
  line-height: 140%;
  color: #9da9bb;
`;

export default function NoComment() {
  return <Wrapper>There are no comments here</Wrapper>;
}
