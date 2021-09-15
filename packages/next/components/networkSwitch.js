import styled, { css } from "styled-components";
import { useState, useRef, useEffect } from "react";

import { nodes } from "utils/constants";
import { useOnClickOutside, useWindowSize } from "utils/hooks";
import { useRouter } from "next/router";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
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
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
  > img.logo {
    flex: 0 0 24px;
  }
`;

const Options = styled.div`
  position: absolute;
  background: #ffffff;
  box-shadow: 0 6px 22px rgba(30, 33, 52, 0.11),
    0 1.34018px 4.91399px rgba(30, 33, 52, 0.0655718),
    0 0.399006px 1.46302px rgba(30, 33, 52, 0.0444282);
  border-radius: 4px;
  padding: 8px 0;
  width: 100%;
  margin-top: 4px;
  z-index: 999999;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  padding: 0 12px;
  height: 36px;
  font-weight: 500;
  cursor: pointer;
  color: #506176;
  :hover {
    background: #f6f7fa;
  }
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
  }
  > img.logo {
    flex: 0 0 24px;
  }
  ${(p) =>
    p.active &&
    css`
      color: #1e2134;
      background: #f6f7fa;
    `}
`;

export default function NetworkSwitch({ activeNode }) {
  const router = useRouter();
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)}>
        <img src={`/imgs/icons/${activeNode.icon}`} alt="" className="logo" />
        <div>{activeNode.name}</div>
        <img src="/imgs/icons/caret-down.svg" alt="" />
      </Select>
      {show && (
        <Options>
          {nodes.map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                localStorage.setItem("chain", item.value);
                router.push(
                  router.asPath.replace(activeNode.value, item.value)
                );
                setShow(false);
              }}
              active={activeNode.value === nodes[index].value}
            >
              <img src={`/imgs/icons/${item.icon}`} alt="" className="logo" />
              <div>{item.name}</div>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
