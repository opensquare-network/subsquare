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
import Caret from "../icons/caret";
import SignalDefault from "../../assets/imgs/icons/signal-default.svg";
import signalMedium from "../../assets/imgs/icons/signal-medium.png";
import signalSlow from "../../assets/imgs/icons/signal-slow.png";
import signalFast from "../../assets/imgs/icons/signal-fast.png";
import darkSignalMedium from "../../assets/imgs/icons/dark-signal-medium.png";
import darkSignalSlow from "../../assets/imgs/icons/dark-signal-slow.png";
import darkSignalFast from "../../assets/imgs/icons/dark-signal-fast.png";
import { useChainSettings } from "../../context/chain";
import { useThemeMode } from "../../context/theme";
import { NeutralPanel } from "../styled/containers/neutralPanel";

const SignalDefaultIcon = styled(SignalDefault)`
  path {
    fill: var(--neutral500);
  }
`;

const Wrapper = styled.div``;

const SmallSelect = styled.div`
  width: 40px;
  height: 40px;
  background-color: var(--neutral100);
  border-width: 1px;
  border-style: solid;
  border-color: var(--neutral400);
  color: var(--textPrimary);
  border-radius: 8px;
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
  background-color: var(--neutral100);
  border: 1px solid;
  border-color: var(--neutral400);
  color: var(--textPrimary);
  border-radius: 8px;
  height: 40px;
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

const Options = styled(NeutralPanel)`
  border-radius: 8px;
  position: absolute;
  right: 0;
  margin-top: 4px;
  padding: 8px;
  width: 100%;
  z-index: 1;
  color: var(--textPrimary);
  border: 1px solid;
  border-color: var(--neutral300);
  box-shadow: var(--shadow200);

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
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  line-height: 100%;
  cursor: pointer;
  white-space: nowrap;
  color: var(--textPrimary);
  :hover {
    background-color: var(--neutral200);
  }
  ${(p) =>
    p.active &&
    css`
      background-color: var(--neutral200);
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

export default function NodeSwitch({ small }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const windowSize = useWindowSize();
  const chainSettings = useChainSettings();
  const currentNode = useSelector(currentNodeSelector);
  const nodes = useSelector(nodesSelector);
  const [currentNodeSetting, setCurrentNodeSetting] = useState(
    chainSettings.endpoints[0],
  );
  const dispatch = useDispatch();
  const [mode] = useThemeMode();

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (small && windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [small, windowSize]);

  useEffect(() => {
    const url = currentNode;
    if (url) {
      const nodeSetting = (nodes || []).find((item) => item.url === url);
      setCurrentNodeSetting(nodeSetting);
    }
  }, [currentNode, nodes]);

  const getSignalImg = (delay) => {
    let imgFile;
    if (!delay || isNaN(delay)) {
      return <SignalDefaultIcon />;
    } else if (delay >= 300) {
      imgFile = mode === "dark" ? darkSignalSlow : signalSlow;
    } else if (delay >= 100) {
      imgFile = mode === "dark" ? darkSignalMedium : signalMedium;
    } else {
      imgFile = mode === "dark" ? darkSignalFast : signalFast;
    }
    return <img alt="" src={`${imgFile.src}`} width={24} height={24} />;
  };

  if (!currentNodeSetting) {
    return null;
  }

  return (
    <Wrapper className="max-sm:relative" ref={ref}>
      {small && (
        <SmallSelect onClick={() => setShow(!show)}>
          {getSignalImg(currentNodeSetting?.delay)}
        </SmallSelect>
      )}
      {!small && (
        <Select onClick={() => setShow(!show)}>
          {getSignalImg(currentNodeSetting?.delay)}
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
            >
              {getSignalImg(item?.delay)}
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
