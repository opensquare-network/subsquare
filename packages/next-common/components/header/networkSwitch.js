import styled, { css } from "styled-components";
import React, { useEffect, useRef, useState } from "react";
import { nodes } from "../../utils/constants";
import { shadow_200 } from "../../styles/componentCss";
import { useSelector } from "react-redux";
import Loading from "../loading";
import { nodesHeightSelector } from "../../store/reducers/nodeSlice";
import useOnClickOutside from "../../utils/hooks/useOnClickOutside";
import useWindowSize from "../../utils/hooks/useWindowSize";
import ChainIcon from "./chainIcon";
import Caret from "../icons/caret";
import useDarkMode from "../../utils/hooks/useDarkMode";

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
`;

const Select = styled.div`
  background: #fff;
  border: 1px solid #e0e4eb;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      > div > span:last-child {
        color: #fff;
      }
    `};
  border-radius: 4px;
  height: 38px;
  display: flex;
  align-items: center;
  padding: 0 12px;
  cursor: pointer;
  > :not(:first-child) {
    margin-left: 8px;
  }
  > div {
    flex-grow: 1;
    display: flex;
    > :first-child {
      color: #9da9bb;
    }
    > :last-child {
      font-weight: 500;
      color: #1e2134;
    }
  }
  > img.logo {
    flex: 0 0 24px;
  }
`;

const Options = styled.div`
  position: absolute;
  background: #ffffff;
  ${(props) =>
    props?.theme === "dark" &&
    css`
      background: #212433;
      border-color: #363a4d;
      > div > span:last-child {
        color: #fff;
      }
      color: rgba(255, 255, 255, 0.6);
    `};
  ${shadow_200};
  border-radius: 4px;
  padding: 8px 0;
  width: 100%;
  margin-top: 4px;
  z-index: 999999;
`;

const Item = styled.a`
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
  ${(props) =>
    props?.theme === "dark" &&
    css`
      color: rgba(255, 255, 255, 0.6);
      color: #ffffff;
      background: #212433;
      :hover {
        background-color: #272a3a;
      }
    `};
  ${(props) =>
    props?.theme === "light" &&
    props.active &&
    css`
      color: #1e2134;
      background: #f6f7fa;
    `}
`;

const NetworkBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  > div {
  }
  > span {
    margin-left: 4px;
    margin-right: 12px;
  }
  > svg {
    margin-left: 7px;
    margin-right: 15px;
  }
`;

export default function NetworkSwitch({ activeNode, isWeb3Login }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
  const [theme] = useDarkMode();
  const windowSize = useWindowSize();
  const nodesHeight = useSelector(nodesHeightSelector);

  useOnClickOutside(ref, () => setShow(false));

  useEffect(() => {
    if (windowSize.width && windowSize.width <= 768) {
      setShow(false);
    }
  }, [windowSize]);

  return (
    <Wrapper ref={ref}>
      <Select onClick={() => setShow(!show)} theme={theme}>
        <ChainIcon chain={activeNode.value} />
        <NetworkBlock>
          {activeNode?.hideHeight ? (
            <div>{activeNode?.name}</div>
          ) : (
            <>
              <div>Block</div>
              {nodesHeight ? (
                <span>{`#${nodesHeight?.toLocaleString()}`}</span>
              ) : (
                <Loading size={16} />
              )}
            </>
          )}
        </NetworkBlock>
        <Caret />
      </Select>
      {show && (
        <Options theme={theme}>
          {nodes.map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                setShow(false);
              }}
              theme={theme}
              active={activeNode.value === nodes[index].value}
              href={
                activeNode.value === item.value
                  ? null
                  : isWeb3Login
                  ? `https://${item.value}.subsquare.io/login`
                  : `https://${item.value}.subsquare.io`
              }
            >
              <ChainIcon chain={item.value} />
              <div>{item.name}</div>
            </Item>
          ))}
        </Options>
      )}
    </Wrapper>
  );
}
