import noop from "lodash.noop";
import React from "react";
import styled, { css } from "styled-components";
import { p_14_normal } from "../styles/componentCss";

const Wrapper = styled.div`
  flex-grow: 1;
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  overflow: hidden;

  color: var(--textDisabled);
`;

const Input = styled.input`
  ${p_14_normal}
  width: 100%;
  border: none;
  outline: none;
  padding: 12px 16px;
  ${(p) =>
    p.disabled &&
    css`
      background: var(--neutral200) !important;
    `}
  background-color: rgba(0,0,0,0);
  color: var(--textPrimary);
`;

export default function LineInput({
  disabled = false,
  value,
  setValue = noop,
  placeholder = "",
  style = {},
}) {
  return (
    <Wrapper>
      <Input
        style={style}
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
}
