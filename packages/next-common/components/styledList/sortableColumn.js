import React from "react";
import styled from "styled-components";
import SortedSVG from "./sorted.svg";

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

export default function SortableColumn({ name, sorted = true }) {
  return (
    <Wrapper>
      {sorted && <SortedSVG />}
      <span>{name}</span>
    </Wrapper>
  );
}
