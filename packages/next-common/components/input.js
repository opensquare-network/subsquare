import React, { forwardRef, useRef, useState } from "react";
import styled, { css } from "styled-components";
import ErrorText from "next-common/components/ErrorText";
import EyeIcon from "../assets/imgs/icons/eye.svg";
import EyeSlashIcon from "../assets/imgs/icons/eye-slash.svg";
import { cn } from "../utils";
import FlexBetweenCenter from "./styled/flexBetweenCenter";
import { noop } from "lodash-es";

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
  border: 1px solid;
  border-color: inherit;
  width: inherit;
  height: inherit;
  border-radius: inherit;
  :hover {
    border-color: var(--neutral500);
  }
  ${(p) =>
    p.focus &&
    css`
      border-color: var(--neutral500);
    `}
  ${(p) =>
    p.error &&
    css`
      border-color: var(--red500) !important;
    `}
  ${(p) =>
    p.disabled &&
    css`
      background-color: var(--neutral200);
      :hover {
        border-color: var(--neutral400);
      }
    `}
  display:flex;
  align-items: center;
  overflow: hidden;
  cursor: text;
`;

const InputWrapper = styled.input`
  all: unset;
  flex-grow: 1;
  display: block;
  padding: 10px 16px;
  font-size: 14px;
  color: var(--textPrimary);
  background-color: inherit;
  ::placeholder {
    color: var(--textDisabled);
  }
  caret-color: var(--textPrimary);
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
    fill: var(--textDisabled);
  }
  :hover {
    > svg {
      fill: var(--textDisabled);
    }
  }
`;

const PostWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
`;

const SymbolWrapper = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: var(--neutral200);
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  border-left: 1px solid var(--neutral400);
  color: var(--textPrimary);
`;

const Prefix = styled(FlexBetweenCenter)`
  margin-left: 12px;
`;

const Suffix = styled(FlexBetweenCenter)`
  position: absolute;
  right: 13px;
  background-color: inherit;
`;

/**
 * @param {import("react").HTMLAttributes<HTMLInputElement>} props
 */
function Input(
  {
    onChange = noop,
    prefix,
    suffix,
    suffixStyle,
    onKeyDown = noop,
    onFocus = noop,
    onBlur = noop,
    className,
    prefixClassName,
    ...props
  },
  ref,
) {
  const [show, setShow] = useState(false);
  const [focus, setFocus] = useState(false);
  const inputRef = useRef();

  function handleOnFocus(event) {
    setFocus(true);
    onFocus(event);
  }
  function handleOnBlur(event) {
    setFocus(false);
    onBlur(event);
  }

  return (
    <div
      className={cn(
        "overflow-hidden",
        "rounded-lg",
        "border-neutral400",
        className,
      )}
    >
      <Wrapper
        focus={focus}
        data-focus={focus}
        onClick={() => {
          inputRef.current?.focus?.();
          setFocus(true);
        }}
        {...props}
      >
        {prefix && <Prefix className={prefixClassName}>{prefix}</Prefix>}

        <InputWrapper
          ref={(el) => {
            inputRef.current = el;
            if (ref) {
              ref.current = el;
            }
          }}
          {...props}
          type={
            props.type === "password" && show ? "text" : props.type ?? "auto"
          }
          style={{
            paddingLeft: prefix ? 8 : null,
          }}
          autocomplete="off"
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          onChange={onChange}
          onKeyDown={onKeyDown}
        />

        {suffix && <Suffix style={suffixStyle}>{suffix}</Suffix>}

        {props.type === "password" && (
          <ShowButton onClick={() => setShow(!show)}>
            {show ? <EyeIcon /> : <EyeSlashIcon />}
          </ShowButton>
        )}
        {props.post && <PostWrapper>{props.post}</PostWrapper>}
        {props.symbol && <SymbolWrapper>{props.symbol}</SymbolWrapper>}
      </Wrapper>
      {props.error && <ErrorText>{props.error}</ErrorText>}
    </div>
  );
}

export default forwardRef(Input);
