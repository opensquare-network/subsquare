import React from "react";
import styled, { css } from "styled-components";
import { p_14_normal } from "../styles/componentCss";

const Wrapper = styled.div`
  border: 1px solid ${(props) => props.theme.grey300Border};
  border-radius: 4px;
  overflow: hidden;

  ${p_14_normal}
  color: ${(props) => props.theme.textPlaceholder};
`;

const Input = styled.input`
  border: none;
  outline: none;
  padding: 12px 16px;
  ${(p) =>
    p.disabled &&
    css`
      background: ${(props) => props.theme.grey100Bg} !important;
    `}
  color: ${(props) => props.theme.textPrimary};
`;

export default function LineInput({
  disabled = false,
  value,
  setValue = () => {},
  placeholder = "",
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
