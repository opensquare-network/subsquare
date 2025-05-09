import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  font-size: 12px;
  color: var(--red500);
  margin-top: 8px;
`;

export default function ErrorText({ children, className }) {
  return <Wrapper className={className}>{children}</Wrapper>;
}
