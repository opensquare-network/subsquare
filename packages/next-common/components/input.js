import React, { useState } from "react";
import styled, { css } from "styled-components";
import ErrorText from "next-common/components/ErrorText";
import EyeIcon from "../assets/imgs/icons/eye.svg";
import EyeSlashIcon from "../assets/imgs/icons/eye-slash.svg";

const Wrapper = styled.div`
  position: relative;
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
  }
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
  }
  input[type="number"] {
    -moz-appearance: textfield;
  }
  border: 1px solid #e0e4eb;
  width: 100%;
  border-radius: 4px;
  :hover {
    border-color: #c2c8d5;
  }
  ${(p) =>
    p.focus &&
    css`
      border-color: #c2c8d5;
    `}
  ${(p) =>
    p.error &&
    css`
      border-color: #f44336 !important;
    `}
  ${(p) =>
    p.disabled &&
    css`
      background: #f6f7fa;
      :hover {
        border-color: #e0e4eb;
      }
    `}
  display:flex;
  overflow: hidden;
`;

const InputWrapper = styled.input`
  all: unset;
  flex-grow: 1;
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  color: #1e2134;
  background: transparent;
  ::placeholder {
    color: #d7dee8;
  }
`;

const ShowButton = styled.div`
  width: 20px;
  height: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  > svg {
    width: 14px;
    height: 14px;
    fill: #d7dee8;
  }
  :hover {
    > svg {
      fill: #9da9bb;
    }
  }
`;

const PostWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const SymbolWrapper = styled.div`
  background: #f6f7fa;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  border-left: 1px solid #e0e4eb;
`;
const OuterWrapper = styled.div``

export default function Input({ ...props }) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);

  return (
    <OuterWrapper>
      <Wrapper focus={focus} {...props}>
        <InputWrapper
          {...props}
          type={props.type === "password" && show ? "text" : props.type ?? "auto"}
          autocomplete="off"
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
        />
        {props.type === "password" && (
          <ShowButton onClick={() => setShow(!show)}>
            {show ? <EyeIcon /> : <EyeSlashIcon />}
          </ShowButton>
        )}
        {props.post && <PostWrapper>{props.post}</PostWrapper>}
        {props.symbol && <SymbolWrapper>{props.symbol}</SymbolWrapper>}
      </Wrapper>
      {props.error && <ErrorText>{props.error}</ErrorText>}
    </OuterWrapper>
  );
}
