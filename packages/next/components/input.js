import styled, { css } from "styled-components";
import { useState } from "react";

const Wrapper = styled.div`
  position: relative;
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
  ::placeholder {
    color: #d7dee8;
  }
  ${(p) =>
    p.type === "password" &&
    css`
      padding-right: 38px;
    `}
  ${(p) =>
    p.error &&
    css`
      border-color: #f44336;
    `}
  ${(p) =>
    p.disabled &&
    css`
      background: #f6f7fa;
    `}
`;
const Error = styled.div`
  font-size: 12px;
  color: #f44336;
  margin-top: 8px;
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
  img {
    filter: invert(87%) sepia(9%) saturate(589%) hue-rotate(180deg)
      brightness(78%) contrast(84%);
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
      />
      {props.type === "password" && (
        <ShowButton onClick={() => setShow(!show)}>
          <img
            src={show ? "/imgs/icons/eye-slash.svg" : "/imgs/icons/eye.svg"}
          />
        </ShowButton>
      )}
      {props.error && <Error>{props.error}</Error>}
      {props.post && <PostWrapper>{props.post}</PostWrapper>}
    </Wrapper>
  );
}
