import styled, { css } from "styled-components";
import { useState } from "react";
import ErrorText from "./ErrorText";
import EyeIcon from "public/imgs/icons/eye.svg";
import EyeSlashIcon from "public/imgs/icons/eye-slash.svg";

const Wrapper = styled.div`
  position: relative;
  input:-webkit-autofill,
  input:-webkit-autofill:hover,
  input:-webkit-autofill:focus,
  input:-webkit-autofill:active {
    -webkit-box-shadow: 0 0 0 30px white inset !important;
    box-shadow: 0 0 0 30px white inset !important;
  }
`;

const InputWrapper = styled.input`
  all: unset;
  border: 1px solid #e0e4eb;
  display: block;
  width: 100%;
  padding: 10px 16px;
  box-sizing: border-box;
  font-size: 14px;
  border-radius: 4px;
  color: #1e2134;
  :hover {
    border-color: #c2c8d5;
  }
  :focus {
    border-color: #c2c8d5;
  }
  ::placeholder {
    color: #d7dee8;
  }
  ${(p) =>
    p.error &&
    css`
      border-color: #f44336 !important;
    `}
  ${(p) =>
    p.disabled &&
    css`
      background: #f6f7fa;
    `}
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

export default function Input({ ...props }) {
  const [show, setShow] = useState(false);

  return (
    <Wrapper>
      <InputWrapper
        {...props}
        type={props.type === "password" && show ? "text" : props.type ?? "auto"}
        autocomplete="off"
      />
      {props.type === "password" && (
        <ShowButton onClick={() => setShow(!show)}>
          {show ? <EyeIcon /> : <EyeSlashIcon />}
        </ShowButton>
      )}
      {props.error && <ErrorText>{props.error}</ErrorText>}
      {props.post && <PostWrapper>{props.post}</PostWrapper>}
    </Wrapper>
  );
}
