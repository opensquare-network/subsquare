import React, { forwardRef } from "react";
import styled, { css } from "styled-components";

const OptionWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 16px;
  height: ${(p) => p.height}px;
  font-size: 14px;
  font-weight: 400;
  cursor: pointer;
  color: var(--textPrimary);
  background: var(--neutral100);
  border-color: var(--neutral400);
  :hover {
    background-color: var(--neutral200);
  }

  ${(p) =>
    p.active &&
    css`
      color: var(--textPrimary);
      background-color: var(--neutral200);
    `}
`;

function Option(
  { active = false, children, onClick = () => {}, height, ...rest },
  ref,
) {
  return (
    <OptionWrapper
      role="option"
      active={active}
      onClick={onClick}
      height={height}
      {...rest}
      ref={ref}
    >
      {children}
    </OptionWrapper>
  );
}

export default forwardRef(Option);
