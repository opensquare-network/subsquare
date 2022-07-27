import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  padding: 16px 48px;
  text-align: center;
  font-size: 14px;
  line-height: 140%;
  color: ${(props) => props.theme.textTertiary};
`;

export default function NoComment() {
  return <Wrapper>There are no comments here</Wrapper>;
}
