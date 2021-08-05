import styled, { css } from "styled-components";
import { useState } from "react";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 38px;
  height: 22px;
  background: #c2c8d5;
  border-radius: 16px;
  > div {
    width: 14px;
    height: 14px;
    position: absolute;
    top: 4px;
    left: 4px;
    background: #ffffff;
    border-radius: 7px;
  }
  ${(p) =>
    p.active &&
    css`
      background: #6848ff;
      > div {
        left: auto;
        right: 4px;
      }
    `}
`;

export default function Toggle() {
  const [active, setActive] = useState(true);

  return (
    <Wrapper active={active} onClick={() => setActive(!active)}>
      <div />
    </Wrapper>
  );
}
