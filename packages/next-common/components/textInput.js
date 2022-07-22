import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  display: flex;
  overflow: hidden;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 100%;
  color: #d7dee8;
`;

const Input = styled.textarea`
  ${(p) =>
    p.disabled &&
    css`
      background: #f6f7fa !important;
    `}
  all: unset;
  padding: 12px 16px;
  flex-grow: 1;
  color: #1E2134;

  height: 40px;

  font-style: normal;
  font-weight: 400;
  font-size: 14px;
  line-height: 20px;
`;

export default function TextInput({
  disabled = false,
  value,
  setValue = () => {},
}) {
  return (
    <Wrapper>
      <Input
        disabled={disabled}
        type="text"
        placeholder="Please fill the reason..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </Wrapper>
  );
}
