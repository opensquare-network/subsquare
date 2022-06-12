import styled, { css } from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import useWindowSize from "../../utils/hooks/useWindowSize";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import {
  currentNodeSelector,
  nodesSelector,
  setCurrentNode,
} from "../../store/reducers/nodeSlice";
import getChainSettings from "../../utils/consts/settings";

const Wrapper = styled.div`
  position: relative;
`;

const SmallSelect = styled.div`
  background: #fff;
  width: 38px;
  height: 38px;
  border: 1px solid #e0e4eb;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  > img {
    width: 24px;
    height: 24px;
  }
`;

const Select = styled.div`
  background: #ffffff;
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
    width: 24px;
    height: 24px;
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
      min-width: 192px;
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
  color: #506176;
  :hover {
    background: #f6f7fa;
  }
  > img {
    width: 24px;
    height: 24px;
  }
  > :not(:last-child) {
    margin-right: 8px;
  }
  .delay {
    margin-left: auto;
    color: ${(p) => p.color};
  }
  ${(p) =>
    p.active &&
    css`
      color: #1e2134;
      background: #f6f7fa;
    `}
`;

export default function NodeSwitch({ small, chain }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const currentNode = useSelector(currentNodeSelector);
  const nodes = useSelector(nodesSelector);
  const [currentNodeSetting, setCurrentNodeSetting] = useState(
    getChainSettings(chain).endpoints
  );
  const dispatch = useDispatch();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (small && windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [small, windowSize]);

  useEffect(() => {
    if (chain) {
      const url = currentNode;
      if (url) {
        const nodeSetting = (nodes || []).find((item) => item.url === url);
        setCurrentNodeSetting(nodeSetting);
      }
    }
  }, [currentNode, nodes, chain]);

  const getSignalImg = (delay) => {
    if (!delay || isNaN(delay)) return "signal-default.png";
    if (delay >= 300) return "signal-slow.png";
    if (delay >= 100) return "signal-medium.png";
    return "signal-fast.png";
  };

  const getSignalColor = (delay) => {
    if (!delay || isNaN(delay)) return "#C2C8D5";
    if (delay >= 300) return "#F44336";
    if (delay >= 100) return "#FF9800";
    return "#4CAF50";
  };

  if (!currentNodeSetting) {
    return null;
  }

  return (
    <Wrapper ref={ref}>
      {small && (
        <SmallSelect onClick={() => setShow(!show)}>
          <img
            alt=""
            src={`/imgs/icons/${getSignalImg(currentNodeSetting?.delay)}`}
            width={24}
            height={24}
          />
        </SmallSelect>
      )}
      {!small && (
        <Select onClick={() => setShow(!show)}>
          <img
            alt=""
            src={`/imgs/icons/${getSignalImg(currentNodeSetting?.delay)}`}
            className="signal"
            width={24}
            height={24}
          />
          <div>{currentNodeSetting?.name}</div>
          <img src="/imgs/icons/caret-down.svg" alt="" width={14} height={14} />
        </Select>
      )}
      {show && (
        <Options small={small}>
          {(nodes || []).map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                if (item.url === currentNodeSetting.url) {
                  setShow(false);
                  return;
                }
                dispatch(setCurrentNode({ url: item.url }));
                setShow(false);
              }}
              active={item.url === currentNodeSetting.url}
              color={getSignalColor(item?.delay)}
            >
              <img
                alt=""
                src={`/imgs/icons/${getSignalImg(item?.delay)}`}
                width={24}
                height={24}
              />
              <div>{`${item?.name}`}</div>
              <div className="delay">
                {item?.delay && !isNaN(item?.delay) ? `${item.delay} ms` : ""}
              </div>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
