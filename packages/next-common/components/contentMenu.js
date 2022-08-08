import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { shadow_200 } from "../styles/componentCss";

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
  background: ${(props) => props.theme.neutral};
  width: 96px;
  padding: 8px 0;
  border-radius: 4px;
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)} px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
  ${shadow_200};
`;

const OptionItem = styled.div`
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  padding: 0 12px;
  font-weight: 500;
  color: ${(props) => props.theme.textPrimary};

  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
`;

export default function ContentMenu({ edit, setIsEdit, onCopy, alwaysShow }) {
  const [show, setShow] = useState(false);
  const [copyState, setCopyState] = useState(false);
  const ref = useRef();

  useEffect(() => {
    if (copyState) {
      setTimeout(() => {
        setCopyState(false);
      }, 3000);
    }
  }, [copyState]);

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
        <OptionWrapper>
          {edit && (
            <OptionItem
              onClick={() => {
                setIsEdit(true);
                setShow(false);
              }}
            >
              Edit
            </OptionItem>
          )}
          <OptionItem
            onClick={() => {
              try {
                onCopy && onCopy();
              } catch (e) {
              } finally {
                setCopyState(true);
              }
            }}
          >
            {copyState ? "Copied" : "Copy"}
          </OptionItem>
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
