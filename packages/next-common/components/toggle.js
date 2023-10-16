import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  position: relative;
  cursor: pointer;
  width: 38px;
  height: 22px;
  background: var(--neutral500);
  border-radius: 16px;
  > div {
    width: 14px;
    height: 14px;
    position: absolute;
    top: 4px;
    left: 4px;
    background: var(--neutral100);
    border-radius: 7px;
  }
  ${(p) =>
    p.disabled
      ? css`
          cursor: default;
          background: var(--neutral300);
          > div {
            right: 4px;
          }
        `
      : p.active
      ? css`
          background: var(--theme500);
          > div {
            left: auto;
            right: 4px;
          }
        `
      : null}
  ${(p) =>
    p.size === "small" &&
    css`
      width: 32px;
      height: 20px;
      > div {
        width: 12px;
        height: 12px;
        top: 4px;
        left: 4px;
        border-radius: 8px;
      }
      ${(p) =>
        p.active &&
        css`
          background: var(--theme500);
          > div {
            left: auto;
            right: 3px;
          }
        `}
    `}
`;

export default function Toggle({ disabled, isOn, onToggle, size }) {
  return (
    <Wrapper
      disabled={disabled}
      active={isOn}
      onClick={() => onToggle(!isOn)}
      size={size}
    >
      <div />
    </Wrapper>
  );
}
