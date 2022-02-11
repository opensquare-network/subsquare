import styled, { css } from "styled-components";
import { useState, useRef } from "react";

import useOnClickOutside from "next-common/utils/hooks/useOnClickOutside.js";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
  line-height: 100%;
`;

const Selector = styled.div`
  padding: 11px 15px;
  display: flex;
  align-items: center;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  cursor: pointer;
  > div {
    flex-grow: 1;
  }
  > img {
    width: 14px;
    height: 14px;
    margin-left: 8px;
  }
  ${(p) =>
    p.active &&
    css`
      border: 1px solid #c2c8d5;
    `}
  ${(p) =>
    p.disabled &&
    css`
      background: #f6f7fa;
      pointer-events: none;
    `}
`;

const Options = styled.div`
  position: absolute;
  padding: 8px 0;
  background: #ffffff;
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 4px;
  left: 0;
  margin-top: 4px;
  width: 100%;
`;

const Item = styled.div`
  padding: 12px 16px;
  cursor: pointer;
  :hover {
    background: #f6f7fa;
  }
  ${(p) =>
    p.active &&
    css`
      background: #f6f7fa;
    `}
`;

export default function Select({ value, setValue, options, disabled }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper ref={ref}>
      <Selector
        active={show}
        disabled={disabled}
        onClick={() => setShow(!show)}
      >
        <div>{(options || []).find((item) => item.value === value)?.text}</div>
        <img
          alt=""
          src={show ? "/imgs/icons/caret-up.svg" : "/imgs/icons/caret-down.svg"}
        />
      </Selector>
      {show && !disabled && (
        <Options>
          {(options || []).map((item, index) => (
            <Item
              key={index}
              active={item.value === value}
              onClick={() => {
                setValue(item.value);
                setShow(false);
              }}
            >
              {item.text}
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
