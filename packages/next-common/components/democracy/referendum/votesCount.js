import React from "react";
import styled from "styled-components";

const Wrapper = styled.span`
  color: var(--textTertiary);
  margin-left: 4px;
`;

export default function VotesCount({ children }) {
  return <Wrapper>({children})</Wrapper>;
}
