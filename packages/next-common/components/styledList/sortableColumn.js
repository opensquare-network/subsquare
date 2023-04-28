import React from "react";
import styled from "styled-components";
import SortedSVG from "./sorted.svg";

const Wrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
`;

export default function SortableColumn({ name, sorted = true, onClick }) {
  return (
    <Wrapper onClick={onClick}>
      {sorted && <SortedSVG />}
      <span>{name}</span>
    </Wrapper>
  );
}
