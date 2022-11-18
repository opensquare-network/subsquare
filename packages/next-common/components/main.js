import React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  flex-grow: 1;
  max-width: 100%;
`;

export default function Main({ children }) {
  return <Wrapper>{children}</Wrapper>;
}
