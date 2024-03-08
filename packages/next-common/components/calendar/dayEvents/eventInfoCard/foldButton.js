import React from "react";
import styled from "styled-components";
import { noop } from "lodash-es";
import FoldedIcon from "./up.svg";
import UnFoldedIcon from "./down.svg";

const Wrapper = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--neutral400);
  border-radius: 2px;
  width: 20px;
  height: 20px;

  > svg path {
    fill: var(--textSecondary);
  }
`;

export default function FoldButton({ onClick = noop, isFolded }) {
  return (
    <Wrapper onClick={onClick}>
      {isFolded ? <FoldedIcon /> : <UnFoldedIcon />}
    </Wrapper>
  );
}
