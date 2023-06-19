import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  display: flex;
  overflow: hidden;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: var(--textDisabled);
`;

const Input = styled.input`
  ${(p) =>
    p.disabled &&
    css`
      background: var(--neutral200) !important;
    `}
  all: unset;
  padding: 12px 16px;
  flex-grow: 1;
  color: var(--textPrimary);
`;

const Unit = styled.div`
  padding: 12px 16px;
  background: var(--neutral200);
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  border-left: 1px solid var(--neutral400);
  ${(p) =>
    !p.disabled &&
    css`
      color: var(--textPrimary) !important;
    `}
`;

export default function BalanceInput({
  disabled = false,
  symbol,
  value,
  setValue = () => {},
}) {
  return (
    <Wrapper>
      <Input
        disabled={disabled}
        min={0}
        type="number"
        placeholder="0.00"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Unit disabled={disabled}>{symbol}</Unit>
    </Wrapper>
  );
}
