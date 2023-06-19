import React from "react";
import styled, { css } from "styled-components";
import { p_14_normal } from "../styles/componentCss";

const Wrapper = styled.div`
  border: 1px solid var(--neutral400);
  border-radius: 4px;
  display: flex;
  overflow: hidden;

  ${p_14_normal}
  line-height: 100%;
  color: var(--textDisabled);
`;

const Input = styled.textarea`
  ${(p) =>
    p.disabled &&
    css`
      background: var(--neutral200); !important;
    `}
  all: unset;
  padding: 12px 16px;
  flex-grow: 1;
  color: var(--textPrimary);

  height: 40px;
  ${p_14_normal}
`;

export default function TextInput({
  disabled = false,
  value,
  setValue = () => {},
  placeholder = "Please fill the reason...",
}) {
  return (
    <Wrapper>
      <Input
        disabled={disabled}
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
}
