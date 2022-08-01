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
import Caret from "../icons/caret";
import signalDefault from "../../assets/imgs/icons/signal-default.png";
import signalMedium from "../../assets/imgs/icons/signal-medium.png";
import signalSlow from "../../assets/imgs/icons/signal-slow.png";
import signalFast from "../../assets/imgs/icons/signal-fast.png";
import darkSignalMedium from "../../assets/imgs/icons/dark-signal-medium.png";
import darkSignalSlow from "../../assets/imgs/icons/dark-signal-slow.png";
import darkSignalFast from "../../assets/imgs/icons/dark-signal-fast.png";
import useDarkMode from "../../utils/hooks/useDarkMode";
import light from "../styled/theme/light";
import dark from "../styled/theme/dark";

const Wrapper = styled.div`
  position: relative;
`;

const SmallSelect = styled.div`
  background: ${(props) => props.theme.neutral};
  width: 38px;
  height: 38px;
  background: ${(props) => props.theme.neutral};
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)}px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: ${(props) => props.theme.grey300Border};
  color: ${(props) => props.theme.textPrimary};
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
  background: ${(props) => props.theme.neutral};
  border: 1px solid ${(props) => props.theme.grey300Border};
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
  background: ${(props) => props.theme.neutral};
  box-shadow: ${(props) => props.theme.shadow200};
  border-radius: 4px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px 0;
  width: 100%;
  z-index: 1;
  background: ${(props) => props.theme.neutral};
  color: ${(props) => props.theme.textPrimary};
  border: 1px solid ${(props) => props.theme.grey300Border};

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
  color: ${(props) => props.theme.textPrimary};
  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
  ${(p) =>
    p.active &&
    css`
      background: ${(props) => props.theme.grey100Bg};
    `}
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
  const [mode] = useDarkMode();

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
    if (!delay || isNaN(delay)) {
      return signalDefault;
    }
    if (delay >= 300) {
      return mode === "dark" ? darkSignalSlow : signalSlow;
    }
    if (delay >= 100) {
      return mode === "dark" ? darkSignalMedium : signalMedium;
    }
    return mode === "dark" ? darkSignalFast : signalFast;
  };

  const getSignalColor = (delay) => {
    if (!delay || isNaN(delay))
      return mode === "dark" ? dark.grey400Border : light.grey400Border;
    if (delay >= 300) return light.secondaryRed500;
    if (delay >= 100) return light.secondaryYellow500;
    return light.secondaryGreen500;
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
            src={`${getSignalImg(currentNodeSetting?.delay).src}`}
            width={24}
            height={24}
          />
        </SmallSelect>
      )}
      {!small && (
        <Select onClick={() => setShow(!show)}>
          <img
            alt=""
            src={`${getSignalImg(currentNodeSetting?.delay).src}`}
            className="signal"
            width={24}
            height={24}
          />
          <div>{currentNodeSetting?.name}</div>
          <Caret />
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
                src={`${getSignalImg(item?.delay).src}`}
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
