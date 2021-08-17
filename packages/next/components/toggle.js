import styled, { css } from "styled-components";

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

export default function Toggle({ isOn, onToggle }) {
  return (
    <Wrapper active={isOn} onClick={() => onToggle(!isOn)}>
      <div />
    </Wrapper>
  );
}
