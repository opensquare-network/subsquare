import styled, { css } from "styled-components";
import { useState, useRef } from "react";

import { useOnClickOutside } from "utils/hooks";
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
  background: #ffffff;
  width: 96px;
  padding: 8px 0;
  border-radius: 4px;
  ${shadow_200};
`;

const OptionItem = styled.div`
  height: 36px;
  line-height: 36px;
  cursor: pointer;
  padding: 0 12px;
  font-weight: 500;
  :hover {
    background: #f6f7fa;
  }
`;

export default function Edit({ edit, setIsEdit, alwaysShow }) {
  const [show, setShow] = useState(false);
  const ref = useRef();

  useOnClickOutside(ref, () => setShow(false));

  return (
    <Wrapper className="edit" active={show || alwaysShow} ref={ref}>
      <img src="/imgs/icons/more.svg" onClick={() => setShow(!show)} />
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
        </OptionWrapper>
      )}
    </Wrapper>
  );
}
