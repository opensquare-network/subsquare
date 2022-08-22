import React, { useEffect, useRef, useState } from "react";
import styled, { css } from "styled-components";
import useOnClickOutside from "../utils/hooks/useOnClickOutside";
import { OptionItem, OptionWrapper } from "./internalDropdown/styled";

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

export default function ContentMenu({
  edit,
  setIsEdit,
  copy = false,
  onCopy,
  alwaysShow,
}) {
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
          {copy && (
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
              {copyState ? "Copied" : "Copy Link"}
            </OptionItem>
          )}
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
