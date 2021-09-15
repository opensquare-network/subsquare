import styled, { css } from "styled-components";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

import { useOnClickOutside, useWindowSize } from "utils/hooks";
import {
  currentNodeSelector,
  setCurrentNode,
  nodesSelector,
} from "store/reducers/nodeSlice";

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
      width: auto;
      min-width: 180px;
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
  white-space: nowrap;
  :hover {
    background: #f6f7fa;
  }
  > img {
    width: 24px;
    height: 24px;
    margin-right: 8px;
  }
  ${(p) =>
    p.active &&
    css`
      background: #f6f7fa;
    `}
`;

export default function NodeSwitch({ small, chain }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const currentNode = useSelector(currentNodeSelector);
  const nodes = useSelector(nodesSelector);
  const [currentNodeSetting, setCurrentNodeSetting] = useState();
  const dispatch = useDispatch();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (small && windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  useEffect(() => {
    if (chain) {
      const url = currentNode[chain];
      if (url) {
        const nodeSetting = (nodes?.[chain] || []).find(
          (item) => item.url === url
        );
        setCurrentNodeSetting(nodeSetting);
      }
    }
  }, [currentNode, nodes, chain]);

  const getSignalImg = (delay) => {
    if (!delay || isNaN(delay)) return "signal-default.svg";
    if (delay >= 300) return "signal-slow.svg";
    if (delay >= 100) return "signal-medium.svg";
    return "signal-fast.svg";
  };

  return (
    <Wrapper ref={ref}>
      {small && (
        <SmallSelect onClick={() => setShow(!show)}>
          <img src={`/imgs/icons/${getSignalImg(currentNodeSetting?.delay)}`} />
        </SmallSelect>
      )}
      {!small && (
        <Select onClick={() => setShow(!show)}>
          <img
            src={`/imgs/icons/${getSignalImg(currentNodeSetting?.delay)}`}
            alt=""
            className="signal"
          />
          <div>{currentNodeSetting?.name}</div>
          <img src="/imgs/icons/caret-down.svg" alt="" />
        </Select>
      )}
      {show && (
        <Options small={small}>
          {(nodes?.[chain] || []).map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                if (item.url === currentNodeSetting.url) {
                  setShow(false);
                  return;
                }
                dispatch(
                  setCurrentNode({
                    chain,
                    url: item.url,
                  })
                );
                setShow(false);
              }}
              active={item.url === currentNodeSetting.url}
            >
              <img src={`/imgs/icons/${getSignalImg(item?.delay)}`} />
              <div>{`via ${item?.name}`}</div>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
