import styled, { css } from "styled-components";
import { useState, useRef, useEffect } from "react";

import { useOnClickOutside, useWindowSize } from "utils/hooks";

const Wrapper = styled.div`
  position: relative;
`;

const SmallSelect = styled.div`
  width: 38px;
  height: 38px;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const Select = styled.div`
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
  > img.signal {
    flex: 0 0 24px;
  }
`;

const Options = styled.div`
  background: #ffffff;
  box-shadow: 0px 6px 22px rgba(30, 33, 52, 0.11),
    0px 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0px 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 4px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px 0;
  width: 100%;
  z-index: 1;
  ${(p) =>
    p.small &&
    css`
      width: 180px;
    `}
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  cursor: pointer;
  :hover {
    background: #f6f7fa;
  }
  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
`;

export default function NodeSwitch({ small }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (small && windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  return (
    <Wrapper ref={ref}>
      {small && (
        <SmallSelect onClick={() => setShow(!show)}>
          <img src="/imgs/icons/signal-default.svg" />
        </SmallSelect>
      )}
      {!small && (
        <Select onClick={() => setShow(!show)}>
          <img
            src={`/imgs/icons/signal-default.svg`}
            alt=""
            className="signal"
          />
          <div>Parity</div>
          <img src="/imgs/icons/caret-down.svg" alt="" />
        </Select>
      )}
      {show && (
        <Options small={small}>
          <Item onClick={() => setShow(false)}>
            <img src="/imgs/icons/signal-default.svg" />
            <div>via Parity</div>
          </Item>
          <Item onClick={() => setShow(false)}>
            <img src="/imgs/icons/signal-default.svg" />
            <div>via OnFinality</div>
          </Item>
          <Item onClick={() => setShow(false)}>
            <img src="/imgs/icons/signal-default.svg" />
            <div>via Patract Elara</div>
          </Item>
        </Options>
      )}
    </Wrapper>
  );
}
