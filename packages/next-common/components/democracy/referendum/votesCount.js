import React from "react";
import styled from "styled-components";

const Wrapper = styled.span`
  color: ${(props) => props.theme.textTertiary};
  margin-left: 4px;
`

export default function VotesCount({ children }) {
  return <Wrapper>({children})</Wrapper>
}
