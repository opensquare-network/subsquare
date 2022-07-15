import React, { useState, useRef } from "react";
import styled, { css } from "styled-components";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { shadow_200 } from "../styles/componentCss";
import useDarkMode from "../utils/hooks/useDarkMode";

const Wrapper = styled.div`
  margin-left: auto;
  position: relative;
  display: none;

  > img {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }

  ${(p) =>
    p.active &&
    css`
      display: block;
    `}
`;

const OptionWrapper = styled.div`
  position: absolute;
  right: 0;
  bottom: 100%;
  background: #ffffff;
  width: 96px;
  padding: 8px 0;
  border-radius: 4px;
  ${shadow_200};
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      color: white;
    `}
`;

const OptionItem = styled.div`
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  padding: 0 12px;
  font-weight: 500;

  :hover {
    background: #f6f7fa;
    ${(props) =>
      props?.theme === "dark" &&
      css`
        background: #1d1e2c;
        color: white;
      `}
  }
`;

export default function Edit({ edit, setIsEdit, alwaysShow }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [theme] = useDarkMode();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper className="edit" active={show || alwaysShow} ref={ref}>
      <img
        alt=""
        src="/imgs/icons/more.svg"
        onClick={() => setShow(!show)}
        width={24}
        height={24}
      />
      {show && (
        <OptionWrapper theme={theme}>
          {edit && (
            <OptionItem
              onClick={() => {
                setIsEdit(true);
                setShow(false);
              }}
              theme={theme}
            >
              Edit
            </OptionItem>
          )}
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
