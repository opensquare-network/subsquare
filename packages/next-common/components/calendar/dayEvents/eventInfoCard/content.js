import React from "react";
import styled from "styled-components";
import { EventTypeToComponent } from "./utils";

const Wrapper = styled.div`
  font-family: "Inter";
  font-style: normal;
  font-weight: 400;
  font-size: 12px;
  line-height: 16px;

  color: ${(p) => p.theme.textPrimary};
`;

export default function Content({ type, ...props }) {
  const Component = EventTypeToComponent[type];
  if (!Component) {
    return null;
  }

  return (
    <Wrapper>
      <Component {...props} />
    </Wrapper>
  );
}
