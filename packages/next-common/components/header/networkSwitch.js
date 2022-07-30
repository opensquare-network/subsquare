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

const Wrapper = styled.div`
  position: relative;
  font-size: 14px;
`;

const Select = styled.div`
  background: #fff;
  border: 1px solid ${(props) => props.theme.grey300Border};
  background: ${(props) => props.theme.neutral};
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
      color: ${(props) => props.theme.textTertiary};
    }
    > :last-child {
      font-weight: 500;
      color: ${(props) => props.theme.textPrimary};
    }
  }
  > img.logo {
    flex: 0 0 24px;
  }
`;

const Options = styled.div`
  position: absolute;
  background: ${(props) => props.theme.neutral};
  border-width: ${(props) => (props.theme.isDark ? 1 : 0)} px;
  border-style: ${(props) => (props.theme.isDark ? "solid" : "none")};
  border-color: ${(props) => props.theme.grey200Border};
  color: ${(props) => props.theme.textPrimary};
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
  color: ${(props) => props.theme.textPrimary};
  :hover {
    background: ${(props) => props.theme.grey100Bg};
  }
  ${(p) =>
    p.active &&
    css`
      background: ${(props) => props.theme.grey100Bg};
    `}
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

const NetworkBlock = styled.div`
  display: flex;
  align-items: center;
  margin-left: 12px;
  > span {
    margin-left: 4px;
    margin-right: 12px;
    color: ${(props) => props.theme.textPrimary};
  }
  > svg {
    margin-left: 7px;
    margin-right: 15px;
  }
`;

export default function NetworkSwitch({ activeNode }) {
  const [show, setShow] = useState(false);
  const ref = useRef();
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
      <Select onClick={() => setShow(!show)}>
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
        <Options>
          {nodes.map((item, index) => (
            <Item
              key={index}
              onClick={() => {
                setShow(false);
              }}
              active={activeNode.value === nodes[index].value}
              href={
                activeNode.value === item.value
                  ? null
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
